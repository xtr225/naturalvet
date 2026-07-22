<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use PhpOffice\PhpSpreadsheet\IOFactory;

class TestExcel extends Command
{
    protected $signature = 'excel:test';

    protected $description = 'Prueba lectura de Excel';

    public function handle()
    {
        $archivo = base_path('DATOS_R. VENTAS_GRAFICOS(1).xlsx');

        if (!file_exists($archivo)) {
            $this->error("No existe el archivo:");
            $this->line($archivo);
            return self::FAILURE;
        }

        $spreadsheet = IOFactory::load($archivo);

        foreach ($spreadsheet->getWorksheetIterator() as $sheet) {

            $this->info("Hoja: ".$sheet->getTitle());

            $rows = $sheet->toArray();

            $this->line("Filas: ".count($rows));
        }

        return self::SUCCESS;
    }
}
