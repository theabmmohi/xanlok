<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Controller;

Route::inertia('/', 'Index')->name('index');

Route::middleware('auth')->group(function () {
    Route::inertia('/settings/profile', 'Settings/Profile');
    Route::get('/settings/security', [Controller::class, 'settingsSecurity'])
        ->name('settings.security');
    Route::post('/user/avatar', [Controller::class, 'userAvatar'])
        ->name('user-avatar.update');
});

Route::post('/check/username', [Controller::class, 'checkUsername'])
    ->middleware('throttle:100,720')
    ->name('check.username');
