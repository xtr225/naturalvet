<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pet;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PetController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Pet::query()->with(['client', 'medicalRecords']);

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('breed', 'like', "%{$search}%")
                ->orWhereHas('client', fn ($builder) => $builder->where('first_name', 'like', "%{$search}%")->orWhere('last_name', 'like', "%{$search}%"));
        }

        if ($request->filled('species') && $request->species !== 'all') {
            $query->where('species', $request->species);
        }

        return response()->json(['data' => $query->orderBy('name')->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $pet = Pet::query()->create($this->validateData($request));

        return response()->json(['data' => $pet->load(['client', 'medicalRecords'])], 201);
    }

    public function show(Pet $pet): JsonResponse
    {
        return response()->json(['data' => $pet->load(['client', 'medicalRecords'])]);
    }

    public function update(Request $request, Pet $pet): JsonResponse
    {
        $pet->update($this->validateData($request));

        return response()->json(['data' => $pet->fresh()->load(['client', 'medicalRecords'])]);
    }

    public function destroy(Pet $pet): JsonResponse
    {
        $pet->delete();

        return response()->json(['message' => 'Mascota eliminada']);
    }

    private function validateData(Request $request): array
    {
        return $request->validate([
            'client_id' => ['required', 'exists:clients,id'],
            'name' => ['required', 'string', 'min:2'],
            'species' => ['required', 'string'],
            'breed' => ['required', 'string'],
            'sex' => ['required', 'in:female,male'],
            'birth_date' => ['required', 'date'],
            'weight' => ['required', 'numeric', 'min:0'],
            'color' => ['required', 'string'],
            'status' => ['required', 'in:active,inactive'],
            'notes' => ['nullable', 'string'],
        ]);
    }
}
