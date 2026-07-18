<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$request = Illuminate\Http\Request::create('/api/users', 'GET', ['role' => 'SuperAdmin,Archbishop']);
$controller = new App\Http\Controllers\UserController();
echo $controller->index($request)->getContent();
