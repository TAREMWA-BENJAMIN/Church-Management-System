<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$user = App\Models\User::find(2); // Kampala Diocese Admin
Auth::login($user);

$request = Illuminate\Http\Request::create('/api/users?role=SuperAdmin,Archbishop', 'GET');
$response = $kernel->handle($request);
echo "STATUS: " . $response->getStatusCode() . "\n";
echo "BODY: " . $response->getContent() . "\n";
