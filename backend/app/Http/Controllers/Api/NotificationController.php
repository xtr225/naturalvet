<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VetNotification;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = VetNotification::query();

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        return response()->json([
            'data' => $query->latest()->limit(100)->get(),
        ]);
    }

    public function generateReminders(NotificationService $notifications): JsonResponse
{
    $items = $notifications->generateAppointmentReminders();

    return response()->json([
        'success' => true,
        'message' => 'Recordatorios procesados correctamente.',
        'created' => $items->count(),
        'data' => $items,
    ], 200);
}

    public function store(Request $request, NotificationService $notifications): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'min:3'],
            'message' => ['required', 'string', 'min:5'],
        ]);

        $notification = $notifications->createPending($data['title'], $data['message'], now());

        return response()->json(['data' => $notification], 201);
    }

    public function markSent(VetNotification $notification): JsonResponse
    {
        $notification->update([
            'status' => 'sent',
            'sent_at' => now(),
        ]);

        return response()->json(['data' => $notification->fresh()]);
    }
}
