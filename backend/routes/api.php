<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SubjectController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// User management API routes
Route::prefix('users')->group(function () {
    Route::get('/', [UserController::class, 'index']); // List all users
    Route::post('/', [UserController::class, 'store']); // Create user
    Route::get('/{id}', [UserController::class, 'show']); // Get user
    Route::put('/{id}', [UserController::class, 'update']); // Update user
    Route::delete('/{id}', [UserController::class, 'destroy']); // Delete user
});

// Subject management API routes
Route::prefix('subjects')->group(function () {
    Route::get('/', [SubjectController::class, 'index']); // List all subjects
    Route::post('/', [SubjectController::class, 'store']); // Create subject
    Route::get('/{id}', [SubjectController::class, 'show']); // Get subject
    Route::put('/{id}', [SubjectController::class, 'update']); // Update subject
    Route::delete('/{id}', [SubjectController::class, 'destroy']); // Delete subject
});