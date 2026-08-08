<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RestrictAdminAccess
{
    public function handle(Request $request, Closure $next): Response
    {
        $allowed = array_filter(array_map('trim', explode(',', env('ADMIN_ALLOWED_IPS', ''))));

        if (empty($allowed)) {
            abort(404);
        }

        if (!in_array($request->ip(), $allowed)) {
            abort(404);
        }

        return $next($request);
    }
}