<?php

namespace App\Providers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;
use Laravel\Sanctum\Sanctum;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        Sanctum::usePersonalAccessTokenModel(SanctumPersonalAccessToken::class);
//        // Alternative method to share currentUser
//        Inertia::share([
//            'currentUser' => function () {
//                return Auth::check() ? Auth::user() : null;
//            },
//        ]);
    }
}
