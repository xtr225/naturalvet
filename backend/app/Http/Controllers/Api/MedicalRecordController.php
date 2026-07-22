<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MedicalRecord;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MedicalRecordController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = MedicalRecord::query()->with('pet.client');

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $query->where('reason', 'like', "%{$search}%")->orWhere('diagnosis', 'like', "%{$search}%");
        }

        return response()->json(['data' => $query->latest('date')->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $record = MedicalRecord::query()->create($request->validate([
            'pet_id' => ['required', 'exists:pets,id'],
            'date' => ['required', 'date'],
            'reason' => ['required', 'string'],
            'diagnosis' => ['required', 'string'],
            'treatment' => ['required', 'string'],
            'vaccines' => ['nullable', 'string'],
            'attachments' => ['nullable', 'string'],
            'observations' => ['nullable', 'string'],
            'veterinarian' => ['required', 'string'],
        ]));

        return response()->json(['data' => $record->load('pet.client')], 201);
    }

    public function show(MedicalRecord $medicalRecord): JsonResponse
    {
        return response()->json(['data' => $medicalRecord->load('pet.client')]);
    }
}
