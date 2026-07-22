<?php

foreach (App\Models\User::all() as $user) {
    $user->is_super_admin = true;
    $user->save();
    echo "User {$user->name} is now super admin. Status: " . $user->is_super_admin . "\n";
}
