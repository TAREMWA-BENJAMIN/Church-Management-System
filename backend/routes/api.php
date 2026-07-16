<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CommunicationController;
use App\Http\Controllers\DirectoryController;
use App\Http\Controllers\FinanceRecordController;
use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::prefix('directory')->group(function () {
        Route::get('/dioceses', [DirectoryController::class, 'dioceses']);
        Route::get('/archdeaconries', [DirectoryController::class, 'archdeaconries']);
        Route::get('/parishes', [DirectoryController::class, 'parishes']);
        Route::get('/directorates', [DirectoryController::class, 'directorates']);
    });

    Route::get('/communications', [CommunicationController::class, 'index']);
    Route::post('/communications', [CommunicationController::class, 'store']);
    Route::patch('/communications/{id}/read', [CommunicationController::class, 'markAsRead']);

    // Finance Records — real-time capable
    Route::get('/finances', [FinanceRecordController::class, 'index']);
    Route::post('/finances', [FinanceRecordController::class, 'store']);
    Route::get('/finances/parishes', [FinanceRecordController::class, 'parishes']);
});
