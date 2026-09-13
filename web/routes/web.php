<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Controller;

Route::inertia('/', 'Index');

Route::middleware('auth')->group(function () {
    Route::inertia('/settings/profile', 'Settings/Profile');
    Route::inertia('/settings/security', 'Settings/Security');
    Route::post('/user/avatar', [Controller::class, 'updateAvatar'])
        ->name('user-avatar.update');
});

Route::post('/check/username', [Controller::class, 'checkUsername'])
    ->middleware('throttle:100,720')
    ->name('check.username');
