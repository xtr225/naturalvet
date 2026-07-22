<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Services\NaturalVetImportService;
use Illuminate\Support\Facades\Schedule;
use App\Services\NotificationService;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('naturalvet:import-data {path=database/imports/natural_vet_import.json}', function (NaturalVetImportService $importer): int {
    $path = base_path($this->argument('path'));
    $summary = $importer->import($path);

    $this->info('Importación completada.');
    foreach ($summary as $label => $total) {
        $this->line("{$label}: {$total}");
    }
/*
|--------------------------------------------------------------------------
| Natural Vet Scheduler
|--------------------------------------------------------------------------
*/

Schedule::call(function (NotificationService $notifications) {

    $notifications->generateAppointmentReminders();

})->dailyAt('07:00')->name('naturalvet-daily-agenda');

Schedule::call(function (NotificationService $notifications) {

    $notifications->generateClosingSummary();

})->dailyAt('18:00')->name('naturalvet-closing-summary');

    return self::SUCCESS;
})->purpose('Importar datos históricos de Natural Vet desde JSON normalizado');
