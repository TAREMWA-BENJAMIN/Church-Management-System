<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\OrganizationUnit;
use App\Models\RoleAssignment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index()
    {
        // Get users with their role assignments, including the related Role and Organization Unit
        $users = User::with(['roleAssignments.role', 'roleAssignments.organizationUnit'])->get();
        $roles = Role::all();
        $units = OrganizationUnit::all();

        return Inertia::render('People/Index', [
            'users' => $users,
            'roles' => $roles,
            'units' => $units
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'assignments' => 'nullable|array',
            'assignments.*.role_id' => 'required|exists:roles,id',
            'assignments.*.organization_unit_id' => 'required|exists:organization_units,id',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        if (isset($validated['assignments'])) {
            foreach ($validated['assignments'] as $assignment) {
                RoleAssignment::create([
                    'user_id' => $user->id,
                    'role_id' => $assignment['role_id'],
                    'organization_unit_id' => $assignment['organization_unit_id'],
                ]);
                
                // Also assign the role to the user directly via Spatie (if needed for global checks)
                $role = Role::find($assignment['role_id']);
                if ($role) {
                    $user->assignRole($role);
                }
            }
        }

        return redirect()->back()->with('success', 'User created successfully.');
    }

    public function update(Request $request, User $person)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($person->id)],
            'password' => 'nullable|string|min:8',
            'assignments' => 'nullable|array',
            'assignments.*.role_id' => 'required|exists:roles,id',
            'assignments.*.organization_unit_id' => 'required|exists:organization_units,id',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $person->update($updateData);

        // Sync assignments
        $person->roleAssignments()->delete(); // Clear old assignments
        
        // Clear spatie roles
        $person->syncRoles([]);

        if (isset($validated['assignments'])) {
            foreach ($validated['assignments'] as $assignment) {
                RoleAssignment::create([
                    'user_id' => $person->id,
                    'role_id' => $assignment['role_id'],
                    'organization_unit_id' => $assignment['organization_unit_id'],
                ]);
                
                // Assign spatie role
                $role = Role::find($assignment['role_id']);
                if ($role) {
                    $person->assignRole($role);
                }
            }
        }

        return redirect()->back()->with('success', 'User updated successfully.');
    }

    public function destroy(User $person)
    {
        // Don't allow deleting the super admin
        if ($person->email === 'admin@church.org') {
            return redirect()->back()->with('error', 'Cannot delete the system administrator.');
        }
        
        $person->delete();
        return redirect()->back()->with('success', 'User deleted successfully.');
    }
}
