<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\InventoryProduct;
use App\Models\Pet;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'admin@vetsystem.test'],
            [
                'name' => 'Admin Veterinaria',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'permissions' => ['dashboard:view', 'clients:manage', 'pets:manage', 'appointments:manage', 'medical-records:manage', 'inventory:manage', 'payments:manage', 'users:manage', 'reports:view'],
            ]
        );

        $client = Client::query()->updateOrCreate(
            ['document' => '45871236'],
            [
                'first_name' => 'Mariana',
                'last_name' => 'Torres',
                'phone' => '987654321',
                'email' => 'mariana.torres@mail.test',
                'address' => 'Av. Arequipa 1245, Lima',
                'status' => 'active',
                'notes' => 'Prefiere recordatorios por WhatsApp.',
            ]
        );

        Pet::query()->updateOrCreate(
            ['client_id' => $client->id, 'name' => 'Luna'],
            [
                'species' => 'Canino',
                'breed' => 'Labrador',
                'sex' => 'female',
                'birth_date' => '2021-04-12',
                'weight' => 24.5,
                'color' => 'Dorado',
                'status' => 'active',
                'notes' => 'Alergia leve a ciertos shampoos.',
            ]
        );

        foreach ([
            ['name' => 'Vacuna multiple', 'category' => 'Vacunas', 'sku' => 'VAC-MULT-001', 'stock' => 4, 'min_stock' => 12, 'price' => 75],
            ['name' => 'Antipulgas 10kg', 'category' => 'Farmacia', 'sku' => 'ANT-10KG-002', 'stock' => 0, 'min_stock' => 8, 'price' => 48],
            ['name' => 'Jeringas 5ml', 'category' => 'Insumos', 'sku' => 'JER-5ML-003', 'stock' => 7, 'min_stock' => 20, 'price' => 1.5],
        ] as $product) {
            InventoryProduct::query()->updateOrCreate(['sku' => $product['sku']], $product + ['status' => 'active']);
        }
    }
}
