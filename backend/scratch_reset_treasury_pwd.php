<?php
use App\Models\User;
use Illuminate\Support\Facades\Hash;

$user = User::where('email', 'proannoying64@gmail.com')->first();
if ($user) {
    $user->password = Hash::make('password');
    $user->save();
    echo "Password reset to 'password' for " . $user->email . "\n";
}
