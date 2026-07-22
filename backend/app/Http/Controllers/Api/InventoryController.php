<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InventoryMovement;
use App\Models\InventoryProduct;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InventoryController extends Controller
{
    public function products(Request $request): JsonResponse
    {
        $query = InventoryProduct::query();

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $query->where('name', 'like', "%{$search}%")->orWhere('sku', 'like', "%{$search}%");
        }

        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        return response()->json(['data' => $query->orderBy('name')->get()]);
    }

    public function storeProduct(Request $request): JsonResponse
    {
        $product = InventoryProduct::query()->create($request->validate([
            'name' => ['required', 'string'],
            'category' => ['required', 'string'],
            'sku' => ['required', 'string', 'unique:inventory_products,sku'],
            'stock' => ['required', 'integer', 'min:0'],
            'min_stock' => ['required', 'integer', 'min:0'],
            'price' => ['required', 'numeric', 'min:0'],
            'status' => ['required', 'in:active,inactive'],
        ]));

        return response()->json(['data' => $product], 201);
    }

    public function movements(): JsonResponse
    {
        return response()->json(['data' => InventoryMovement::query()->with('product')->latest()->get()]);
    }

    public function storeMovement(Request $request): JsonResponse
    {
        $data = $request->validate([
            'product_id' => ['required', 'exists:inventory_products,id'],
            'type' => ['required', 'in:in,out'],
            'quantity' => ['required', 'integer', 'min:1'],
            'reason' => ['required', 'string'],
        ]);

        $movement = DB::transaction(function () use ($data) {
            $product = InventoryProduct::query()->lockForUpdate()->findOrFail($data['product_id']);
            $nextStock = $data['type'] === 'in'
                ? $product->stock + $data['quantity']
                : $product->stock - $data['quantity'];

            abort_if($nextStock < 0, 422, 'Stock insuficiente');

            $product->update(['stock' => $nextStock]);

            return InventoryMovement::query()->create($data);
        });

        return response()->json(['data' => $movement->load('product')], 201);
    }
}
