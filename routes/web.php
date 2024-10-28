<?php
use Illuminate\Foundation\Application;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;

use App\Http\Controllers\UserController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\ProfileController;

/**
 * Home (redirect to books)
 */
Route::get('/', function () {
    return redirect()->route('book-list');
});

/**
 * Users
 */
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/users', [UserController::class, 'index'])
        ->name('user-list');
    Route::get('/users/search', [UserController::class, 'index'])
        ->name('user-search');
    Route::get('/users/details/{id}', [UserController::class, 'show'])
        ->name('user-details');
    Route::get('/users/create/{id}', [UserController::class, 'create'])
        ->name('user-create');
    Route::get('/users/edit/{id}', [UserController::class, 'edit'])
        ->name('user-edit');
    Route::put('/users/edit/{id}', [UserController::class, 'update'])
        ->name('send-user-edit');
    Route::delete('/users/delete/{id}', [UserController::class, 'destroy'])
        ->name('send-user-destroy');
});

/**
 * Books
 */
Route::get('/books', [BookController::class, 'index'])
    ->name('book-list');
Route::get('/books/search', [BookController::class, 'index'])
    ->name('book-search');
Route::get('/books/details/{id}', [BookController::class, 'show'])
    ->name('book-details');

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/books/create', [BookController::class, 'edit'])
        ->name('book-create');
    Route::get('/books/edit/{id}', [BookController::class, 'edit'])
        ->name('book-edit');
    Route::put('/books/edit/{id}', [BookController::class, 'update'])
        ->name('send-book-edit');
    Route::delete('/books/delete/{id}', [BookController::class, 'destroy'])
        ->name('send-book-delete');
});


/**
 * Profile
 */
Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'index'])
        ->name('profile');

    Route::get('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});


/**
 * Authentication
 */
Route::middleware(['guest'])->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');
    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');

    Route::post('register', [RegisteredUserController::class, 'store'])
        ->name('send-register');
    Route::post('login', [AuthenticatedSessionController::class, 'store'])
        ->name('send-login');
});



