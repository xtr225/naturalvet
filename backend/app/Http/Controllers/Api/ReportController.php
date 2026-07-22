<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Client;
use App\Models\InventoryProduct;
use App\Models\Payment;
use App\Models\Pet;
use Illuminate\Http\JsonResponse;

class ReportController extends Controller
{
    public function summary(): JsonResponse
    {
        $revenue = Payment::query()->where('status', 'paid')->where('type', 'income')->sum('amount');
        $expenses = Payment::query()->where('status', 'paid')->where('type', 'expense')->sum('amount');

        return response()->json([
            'data' => [
                'totals' => [
                    'clients' => Client::query()->count(),
                    'pets' => Pet::query()->count(),
                    'appointments' => Appointment::query()->count(),
                    'revenue' => (float) ($revenue - $expenses),
                    'lowStock' => InventoryProduct::query()->whereColumn('stock', '<=', 'min_stock')->count(),
                ],
                'appointmentStatus' => collect(['scheduled', 'confirmed', 'pending', 'completed', 'cancelled'])
                    ->map(fn ($status) => ['status' => $status, 'total' => Appointment::query()->where('status', $status)->count()])
                    ->values(),
                'topProducts' => InventoryProduct::query()->orderBy('stock')->limit(5)->get(),
            ],
        ]);
    }
}
