<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

       $user = User::where('email', $credentials['email'])->first();
       return response()->json([
        'email_recibido' => $credentials['email'],
        'password_recibido' => $credentials['password'],
        'usuario_encontrado' => $user?->email,
        'hash_ok' => $user ? Hash::check($credentials['password'], $user->password) : false,
        ]);

        $user->forceFill(['api_token' => hash('sha256', Str::random(80))])->save();

        return response()->json([
            'token' => $user->api_token,
            'user' => $this->serializeUser($user),
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['user' => $this->serializeUser($request->user())]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->forceFill(['api_token' => null])->save();

        return response()->json(['message' => 'Sesion cerrada']);
    }

    private function serializeUser(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'roles' => [$user->role],
            'permissions' => $user->permissions ?? [],
        ];
    }
}
