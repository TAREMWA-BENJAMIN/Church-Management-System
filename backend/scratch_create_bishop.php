<?php

use App\Models\User;
use App\Models\OrganizationUnit;
use App\Models\RoleAssignment;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

// 1. Ensure Bishop role exists
$bishopRole = Role::firstOrCreate(['name' => 'Bishop', 'guard_name' => 'web']);

// 2. Find Kampala Diocese
$kampalaDiocese = OrganizationUnit::where('name', 'Kampala Diocese')->first();

if (!$kampalaDiocese) {
    echo "Error: Kampala Diocese not found.\n";
    exit;
}

// 3. Create or find the Bishop user
$email = 'bishop.kampala@church.org';
$bishop = User::firstOrCreate(
    ['email' => $email],
    [
        'name' => 'Bishop of Kampala',
        'password' => Hash::make('password'),
        'is_super_admin' => false
    ]
);

// If user already existed, reset their password just in case
if (!$bishop->wasRecentlyCreated) {
    $bishop->password = Hash::make('password');
    $bishop->is_super_admin = false;
    $bishop->save();
}

// 4. Assign role
// Clear existing assignments for this user just to be safe
RoleAssignment::where('user_id', $bishop->id)->delete();
$bishop->syncRoles([]);

// Create new assignment
RoleAssignment::create([
    'user_id' => $bishop->id,
    'role_id' => $bishopRole->id,
    'organization_unit_id' => $kampalaDiocese->id,
]);
$bishop->assignRole($bishopRole);

echo "Successfully created Bishop user.\n";
echo "Email: " . $email . "\n";
echo "Password: password\n";
