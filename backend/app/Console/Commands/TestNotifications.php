<?php

namespace App\Console\Commands;

use App\Services\NotificationService;
use Illuminate\Console\Command;

class TestNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notifications:test';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Prueba la generación de notificaciones de citas';

    /**
     * Execute the console command.
     */
    public function handle(NotificationService $notifications): int
    {
        $this->info('===========================================');
        $this->info('   NATURAL VET - PRUEBA DE NOTIFICACIONES');
        $this->info('===========================================');
        $this->newLine();

        $items = $notifications->generateAppointmentReminders();

        $this->info('Notificaciones procesadas: '.$items->count());
        $this->newLine();

        foreach ($items as $notification) {
            $this->line('-------------------------------------------');
            $this->line('ID          : '.$notification->id);
            $this->line('Título      : '.$notification->title);
            $this->line('Estado      : '.$notification->status);
            $this->line('Programada  : '.optional($notification->scheduled_at)->format('d/m/Y H:i'));
            $this->line('WhatsApp    : '.$notification->phone);
        }

        $this->newLine();
        $this->info('Prueba finalizada correctamente.');

        return self::SUCCESS;
    }
}
