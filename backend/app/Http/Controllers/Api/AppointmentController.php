<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Appointment::query()->with(['client', 'pet']);

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('date')) {
            $query->whereDate('date', $request->date);
        }

        return response()->json(['data' => $query->orderBy('date')->orderBy('time')->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $appointment = Appointment::query()->create($this->validateData($request));

        return response()->json(['data' => $appointment->load(['client', 'pet'])], 201);
    }

    public function show(Appointment $appointment): JsonResponse
    {
        return response()->json(['data' => $appointment->load(['client', 'pet'])]);
    }

    public function update(Request $request, Appointment $appointment): JsonResponse
    {
        $appointment->update($this->validateData($request));

        return response()->json(['data' => $appointment->fresh()->load(['client', 'pet'])]);
    }

    public function destroy(Appointment $appointment): JsonResponse
    {
        $appointment->delete();

        return response()->json(['message' => 'Cita eliminada']);
    }

    private function validateData(Request $request): array
    {
        return $request->validate([
            'client_id' => ['required', 'exists:clients,id'],
            'pet_id' => ['required', 'exists:pets,id'],
            'service' => ['required', 'string', 'min:3'],
            'date' => ['required', 'date'],
            'time' => ['required'],
            'status' => ['required', 'in:scheduled,confirmed,pending,completed,cancelled'],
            'veterinarian' => ['required', 'string', 'min:3'],
            'notes' => ['nullable', 'string'],
        ]);
    }
}
