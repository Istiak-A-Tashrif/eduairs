<?php

use App\Http\Controllers\API\AdminController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\ProfileController;
use App\Http\Controllers\API\UserRoleController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // Public routes
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{product}', [ProductController::class, 'show']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/profile', [ProfileController::class, 'show']);
        Route::get('/dashboard', [DashboardController::class, 'index']);

        // Product routes (create, update, delete requires authentication and permission)
        Route::middleware(['permission'])->group(function () {
            Route::post('/products', [ProductController::class, 'store']);
            Route::put('/products/{product}', [ProductController::class, 'update']);
            Route::delete('/products/{product}', [ProductController::class, 'destroy']);
        });

        // Admin routes
        Route::middleware('role:Admin')->group(function () {
            Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
            Route::get('/admin/users', [AdminController::class, 'getUsers']);
            Route::get('/admin/statistics', [AdminController::class, 'getStatistics']);
            Route::post('/users/{user}/roles', [UserRoleController::class, 'assignRole']);
        });
    });
});
