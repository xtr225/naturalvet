<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Cors
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->isMethod('OPTIONS')) {
            $response = response('', 204);
        } else {
            $response = $next($request);
        }

        $origin = $request->headers->get('Origin');
        $allowedOrigins = array_filter([
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            env('FRONTEND_URL'),
        ]);

        $isRailwayOrigin = is_string($origin) && str_ends_with(parse_url($origin, PHP_URL_HOST) ?? '', '.up.railway.app');

        if (in_array($origin, $allowedOrigins, true) || $isRailwayOrigin) {
            $response->headers->set('Access-Control-Allow-Origin', $origin);
            $response->headers->set('Vary', 'Origin');
        }

        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');

        return $response;
    }
}
