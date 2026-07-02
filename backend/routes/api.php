<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CommunicationController;
use App\Http\Controllers\DirectoryController;

Route::prefix('directory')->group(function () {
    Route::get('/dioceses', [DirectoryController::class, 'dioceses']);
    Route::get('/archdeaconries', [DirectoryController::class, 'archdeaconries']);
    Route::get('/parishes', [DirectoryController::class, 'parishes']);
});

Route::get('/communications', [CommunicationController::class, 'index']);
Route::post('/communications', [CommunicationController::class, 'store']);
Route::patch('/communications/{id}/read', [CommunicationController::class, 'markAsRead']);
