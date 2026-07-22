<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Payment::query()->with('client');

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        return response()->json(['data' => $query->latest()->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $payment = Payment::query()->create($request->validate([
            'client_id' => ['required', 'exists:clients,id'],
            'concept' => ['required', 'string'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'method' => ['required', 'in:cash,card,transfer'],
            'status' => ['required', 'in:paid,pending,cancelled'],
            'type' => ['sometimes', 'in:income,expense'],
            'category' => ['nullable', 'string'],
            'service' => ['nullable', 'string'],
            'transaction_date' => ['nullable', 'date'],
            'raw_method' => ['nullable', 'string'],
            'source' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ]));

        return response()->json(['data' => $payment->load('client')], 201);
    }
}
