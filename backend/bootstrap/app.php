<?php

use App\Http\Middleware\CheckProductPermission;
use App\Http\Middleware\EnsureUserHasRole;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->api(prepend: [
            EnsureFrontendRequestsAreStateful::class,
            'throttle:60,1',
            SubstituteBindings::class,
        ]);

        $middleware->alias([
            'role' => EnsureUserHasRole::class,
            'permission' => CheckProductPermission::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
