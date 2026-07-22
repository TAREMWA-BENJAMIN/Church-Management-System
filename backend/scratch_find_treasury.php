<?php
use App\Models\User;
use Spatie\Permission\Models\Role;

$roles = Role::where('name', 'like', '%Treasur%')->get();
if ($roles->isEmpty()) {
    echo "No Treasury role found.\n";
} else {
    foreach ($roles as $role) {
        echo "Role: " . $role->name . "\n";
        $users = User::role($role->name)->get();
        if ($users->isEmpty()) {
            echo "  No users with this role.\n";
        } else {
            foreach ($users as $user) {
                echo "  User: " . $user->name . " (Email: " . $user->email . ")\n";
            }
        }
    }
}
