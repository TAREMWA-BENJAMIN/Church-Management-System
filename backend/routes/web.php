<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    Route::resource('organization', \App\Http\Controllers\OrganizationUnitController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('roles', \App\Http\Controllers\RoleController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('people', \App\Http\Controllers\UserController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('members', \App\Http\Controllers\MemberController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::get('/directorates', [\App\Http\Controllers\DirectorateController::class, 'index'])->name('directorates.index');
    Route::resource('finance', \App\Http\Controllers\FinanceRecordController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('assets', \App\Http\Controllers\AssetController::class);
    Route::resource('institutions', \App\Http\Controllers\InstitutionController::class);
    Route::get('/reports', [\App\Http\Controllers\ReportController::class, 'index'])->name('reports.index');

    // Communication Module
    Route::prefix('communications')->group(function () {
        Route::get('/',              [\App\Http\Controllers\CommunicationController::class, 'index'])->name('communications.index');
        Route::post('/',             [\App\Http\Controllers\CommunicationController::class, 'store'])->name('communications.store');
        Route::get('/unread-count',  [\App\Http\Controllers\CommunicationController::class, 'unreadCount'])->name('communications.unreadCount');
        Route::get('/{id}',          [\App\Http\Controllers\CommunicationController::class, 'show'])->name('communications.show');
        Route::post('/{id}/reply',   [\App\Http\Controllers\CommunicationController::class, 'reply'])->name('communications.reply');
        Route::delete('/{id}',       [\App\Http\Controllers\CommunicationController::class, 'destroy'])->name('communications.destroy');
    });
});

require __DIR__.'/auth.php';
