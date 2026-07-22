<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Client::query()->with('pets');

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $query->where(function ($builder) use ($search): void {
                $builder
                    ->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('document', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        return response()->json(['data' => $query->orderBy('first_name')->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $client = Client::query()->create($this->validateData($request));

        return response()->json(['data' => $client->load('pets')], 201);
    }

    public function show(Client $client): JsonResponse
    {
        return response()->json(['data' => $client->load('pets')]);
    }

    public function update(Request $request, Client $client): JsonResponse
    {
        $client->update($this->validateData($request, $client->id));

        return response()->json(['data' => $client->fresh()->load('pets')]);
    }

    public function destroy(Client $client): JsonResponse
    {
        $client->delete();

        return response()->json(['message' => 'Cliente eliminado']);
    }

    private function validateData(Request $request, ?int $clientId = null): array
    {
        return $request->validate([
            'first_name' => ['required', 'string', 'min:2'],
            'last_name' => ['required', 'string', 'min:2'],
            'document' => ['required', 'string', 'min:8', 'unique:clients,document,'.($clientId ?? 'NULL').',id'],
            'phone' => ['required', 'string', 'min:9'],
            'email' => ['required', 'email'],
            'address' => ['required', 'string', 'min:4'],
            'status' => ['required', 'in:active,inactive'],
            'notes' => ['nullable', 'string'],
        ]);
    }
}
