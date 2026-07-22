<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => User::query()->orderBy('name')->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'min:3'],
            'email' => ['required', 'email', 'unique:users,email'],
            'role' => ['required', 'in:admin,reception'],
            'password' => ['nullable', 'string', 'min:6'],
        ]);

        $data['password'] = Hash::make($data['password'] ?? 'password');
        $data['permissions'] = $data['role'] === 'admin'
            ? ['dashboard:view', 'clients:manage', 'pets:manage', 'appointments:manage', 'medical-records:manage', 'inventory:manage', 'payments:manage', 'users:manage', 'reports:view']
            : ['dashboard:view', 'clients:manage', 'pets:manage', 'appointments:manage', 'payments:manage'];

        $user = User::query()->create($data);

        return response()->json(['data' => $user], 201);
    }
}
