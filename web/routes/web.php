<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Index');
Route::inertia('/settings/profile', 'Settings/Profile');
Route::inertia('/settings/security', 'Settings/Security');
