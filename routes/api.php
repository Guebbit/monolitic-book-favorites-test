<?php
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;

use App\Http\Controllers\UserController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\ProfileController;


/**
 * Books
 */
Route::get('/books', [BookController::class, 'index']);
Route::get('/books/details/{id}', [BookController::class, 'show']);

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::put('/books/edit/{book}', [BookController::class, 'update']);
    Route::put('/books/create', [BookController::class, 'store']);
    Route::delete('/books/delete/{book}', [BookController::class, 'destroy']);
});


/**
 * Users
 */
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/details/{id}', [UserController::class, 'show']);
    Route::put('/users/edit/{user}', [UserController::class, 'update']);
    Route::delete('/users/delete/{user}', [UserController::class, 'destroy']);
});

/**
 * Profile
 */
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'index']);
    Route::put('/profile/add-book/{id}', [ProfileController::class, 'addFavorite']);
});


/**
 * Authentication (through api call)
 */
Route::middleware('guest')->group(function () {
    Route::post('register', [RegisteredUserController::class, 'store'])
        ->name('api-register');

    Route::post('login', [AuthenticatedSessionController::class, 'store'])
        ->name('api-login');
});


/**
 * Authentication (token creation)
 */
Route::middleware(['web'])->group(function () {
    Route::post('/tokens/create', [AuthenticatedSessionController::class, 'generateToken']);
});
