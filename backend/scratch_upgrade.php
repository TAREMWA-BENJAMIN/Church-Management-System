<?php

$user = App\Models\User::find(1);
if ($user) {
    $user->is_super_admin = true;
    $user->save();
    echo "User 1 is now super admin. Status: " . $user->is_super_admin . "\n";
} else {
    echo "User not found\n";
}
