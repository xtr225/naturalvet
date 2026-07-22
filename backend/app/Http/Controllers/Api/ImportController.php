<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\NaturalVetImportService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ImportController extends Controller
{
    public function import(
        Request $request,
        NaturalVetImportService $importService
    ): JsonResponse {

        $request->validate([
            'file' => [
                'required',
                'file',
                'mimes:xlsx,xls'
            ]
        ]);

        $summary = $importService->importExcel(
            $request->file('file')->getRealPath()
        );

        return response()->json([
            'message' => 'Importación realizada correctamente.',
            'summary' => $summary
        ]);
    }
}
