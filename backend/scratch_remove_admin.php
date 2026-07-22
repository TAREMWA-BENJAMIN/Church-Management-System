<?php
$u = App\Models\User::where('email', 'proannoying64@gmail.com')->first();
if ($u) {
    $u->is_super_admin = false;
    $u->save();
    echo "Removed super admin access from Benson.\n";
}
