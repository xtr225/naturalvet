<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Client;
use App\Models\InventoryProduct;
use App\Models\Payment;
use App\Models\Pet;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function overview(): JsonResponse
    {
        $revenue = Payment::query()->where('status', 'paid')->where('type', 'income')->sum('amount');
        $expenses = Payment::query()->where('status', 'paid')->where('type', 'expense')->sum('amount');

        return response()->json([
            'data' => [
                'stats' => [
                    'clients' => Client::query()->count(),
                    'pets' => Pet::query()->count(),
                    'appointments' => Appointment::query()->count(),
                    'inventory' => InventoryProduct::query()->count(),
                    'revenue' => (float) ($revenue - $expenses),
                    'completedAppointments' => Appointment::query()->where('status', 'completed')->count(),
                ],
                'appointments' => Appointment::query()->with(['client', 'pet'])->orderBy('date')->orderBy('time')->limit(5)->get(),
                'inventoryAlerts' => InventoryProduct::query()->whereColumn('stock', '<=', 'min_stock')->limit(5)->get(),
                'activity' => [
                    ['id' => 1, 'title' => 'Sistema conectado', 'description' => 'API Laravel operando con MySQL.', 'status' => 'API', 'variant' => 'success', 'date' => now()],
                ],
                'serviceMix' => [
                    ['id' => 1, 'name' => 'Consultas', 'value' => 42, 'variant' => 'info'],
                    ['id' => 2, 'name' => 'Vacunacion', 'value' => 28, 'variant' => 'success'],
                    ['id' => 3, 'name' => 'Peluqueria', 'value' => 18, 'variant' => 'warning'],
                    ['id' => 4, 'name' => 'Cirugias', 'value' => 12, 'variant' => 'danger'],
                ],
            ],
        ]);
    }
}
