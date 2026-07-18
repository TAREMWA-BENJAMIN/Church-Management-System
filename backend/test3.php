<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$request = Illuminate\Http\Request::create('/api/users', 'GET', ['role' => 'SuperAdmin,Archbishop']);
$controller = new App\Http\Controllers\UserController();
echo $controller->index($request)->getContent();
