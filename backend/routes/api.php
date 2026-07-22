<?php

use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\MedicalRecordController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\PetController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\UserController;
use App\Http\Middleware\ApiTokenAuth;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => ['status' => 'ok', 'app' => config('app.name')]);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware(ApiTokenAuth::class)->group(function (): void {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::get('/dashboard/overview', [DashboardController::class, 'overview']);
    Route::get('/reports/summary', [ReportController::class, 'summary']);

    Route::apiResource('clients', ClientController::class);
    Route::apiResource('pets', PetController::class);
    Route::apiResource('appointments', AppointmentController::class);
    Route::apiResource('medical-records', MedicalRecordController::class)->only(['index', 'store', 'show']);
    Route::apiResource('payments', PaymentController::class)->only(['index', 'store']);
    Route::apiResource('users', UserController::class)->only(['index', 'store']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications', [NotificationController::class, 'store']);
    Route::post('/notifications/reminders', [NotificationController::class, 'generateReminders']);
    Route::patch('/notifications/{notification}/sent', [NotificationController::class, 'markSent']);

    Route::get('/inventory/products', [InventoryController::class, 'products']);
    Route::post('/inventory/products', [InventoryController::class, 'storeProduct']);
    Route::get('/inventory/movements', [InventoryController::class, 'movements']);
    Route::post('/inventory/movements', [InventoryController::class, 'storeMovement']);
});
