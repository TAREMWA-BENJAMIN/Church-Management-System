<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\FinanceRecordController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Directory routes removed

    Route::apiResource('/users', UserController::class);

    // Communication routes removed

    // Finance Records — real-time capable
    Route::get('/finances', [FinanceRecordController::class, 'index']);
    Route::post('/finances', [FinanceRecordController::class, 'store']);
    Route::get('/finances/parishes', [FinanceRecordController::class, 'parishes']);
    // Directorates API routes removed
});
