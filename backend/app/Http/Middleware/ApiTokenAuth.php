<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiTokenAuth
{
    public function handle(Request $request, Closure $next): Response
    {
        $header = $request->header('Authorization', '');
        $token = str_starts_with($header, 'Bearer ') ? substr($header, 7) : null;

        if (!$token) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        $user = User::query()->where('api_token', $token)->first();

        if (!$user) {
            return response()->json(['message' => 'Token invalido'], 401);
        }

        $request->merge(['auth_user_id' => $user->id]);
        $request->setUserResolver(fn () => $user);

        return $next($request);
    }
}
