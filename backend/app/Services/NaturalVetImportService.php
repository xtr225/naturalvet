<?php

namespace App\Services;

use App\Models\Client;
use App\Models\MedicalRecord;
use App\Models\Payment;
use App\Models\Pet;
use Illuminate\Support\Facades\DB;
use RuntimeException;
use PhpOffice\PhpSpreadsheet\IOFactory;

class NaturalVetImportService
{
    public function import(string $path): array
    {
        if (! file_exists($path)) {
            throw new RuntimeException("No se encontró el archivo de importación: {$path}");
        }

        $payload = json_decode((string) file_get_contents($path), true);

        if (! is_array($payload)) {
            throw new RuntimeException('El archivo de importación no contiene JSON válido.');
        }

        return DB::transaction(function () use ($payload): array {
            $summary = [
                'clients' => 0,
                'pets' => 0,
                'medical_records' => 0,
                'payments' => 0,
            ];

            foreach ($payload['clinical_records'] ?? [] as $record) {
                $client = Client::query()->updateOrCreate(
                    ['document' => $record['client']['document']],
                    $record['client']
                );
                $summary['clients']++;

                $pet = Pet::query()->updateOrCreate(
                    [
                        'client_id' => $client->id,
                        'name' => $record['pet']['name'],
                    ],
                    array_merge($record['pet'], ['client_id' => $client->id])
                );
                $summary['pets']++;

                MedicalRecord::query()->updateOrCreate(
                    [
                        'pet_id' => $pet->id,
                        'date' => $record['medical_record']['date'],
                        'reason' => $record['medical_record']['reason'],
                    ],
                    array_merge($record['medical_record'], ['pet_id' => $pet->id])
                );
                $summary['medical_records']++;
            }

            $generalClient = Client::query()->firstOrCreate(
                ['document' => 'VENTAS-GENERAL'],
                [
                    'first_name' => 'Cliente',
                    'last_name' => 'General Ventas',
                    'phone' => '000000000',
                    'email' => 'ventas@naturalvet.local',
                    'address' => 'Puno - Perú',
                    'status' => 'active',
                    'notes' => 'Cliente técnico para movimientos de ventas importados sin propietario asociado.',
                ]
            );

            foreach ($payload['sales'] ?? [] as $sale) {
                Payment::query()->updateOrCreate(
                    [
                        'client_id' => $generalClient->id,
                        'concept' => $sale['concept'],
                        'amount' => $sale['amount'],
                        'transaction_date' => $sale['transaction_date'],
                        'source' => $payload['source'] ?? 'Excel importado',
                    ],
                    [
                        'client_id' => $generalClient->id,
                        'concept' => $sale['concept'],
                        'amount' => $sale['amount'],
                        'method' => $sale['method'],
                        'status' => $sale['status'],
                        'type' => $sale['type'],
                        'category' => $sale['category'],
                        'service' => $sale['service'],
                        'transaction_date' => $sale['transaction_date'],
                        'raw_method' => $sale['raw_method'],
                        'source' => $payload['source'] ?? 'Excel importado',
                        'notes' => trim(($sale['month'] ?? '').' '.($sale['month_number'] ?? '')),
                    ]
                );
                $summary['payments']++;
            }

            return $summary;
        });
        public function importExcel(string $path): array
{
    $spreadsheet = IOFactory::load($path);

    /*
     * Aquí construiremos el mismo payload que usa import()
     * para no duplicar la lógica existente.
     */
    $payload = [
        'source' => 'Excel Natural Vet',
        'clinical_records' => [],
        'sales' => [],
    ];

    /*
     * Próximo paso:
     * Leeremos la hoja de historias clínicas y la hoja de ventas
     * para llenar este arreglo.
     */

    return DB::transaction(function () use ($payload) {

        $summary = [
            'clients' => 0,
            'pets' => 0,
            'medical_records' => 0,
            'payments' => 0,
        ];

        foreach ($payload['clinical_records'] as $record) {

            $client = Client::updateOrCreate(
                ['document' => $record['client']['document']],
                $record['client']
            );

            $summary['clients']++;

            $pet = Pet::updateOrCreate(
                [
                    'client_id' => $client->id,
                    'name' => $record['pet']['name'],
                ],
                array_merge(
                    $record['pet'],
                    ['client_id' => $client->id]
                )
            );

            $summary['pets']++;

            MedicalRecord::updateOrCreate(
                [
                    'pet_id' => $pet->id,
                    'date' => $record['medical_record']['date'],
                    'reason' => $record['medical_record']['reason'],
                ],
                array_merge(
                    $record['medical_record'],
                    ['pet_id' => $pet->id]
                )
            );

            $summary['medical_records']++;
        }

        return $summary;
    });
}
    }
}
