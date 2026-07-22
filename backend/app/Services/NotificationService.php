<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\VetNotification;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Config;

class NotificationService
{
    public function targetPhone(): string
    {
        return Config::get('services.natural_vet.notifications_phone', '+51983739689');
    }

    public function createPending(
    string $title,
    string $message,
    ?Carbon $scheduledAt = null,
    ?string $relatedType = null,
    ?int $relatedId = null
): VetNotification
{
    $phone = $this->targetPhone();

    $notification = VetNotification::query()
        ->where('phone', $phone)
        ->where('title', $title)
        ->where('related_type', $relatedType)
        ->where('related_id', $relatedId)
        ->when($scheduledAt, function ($query) use ($scheduledAt) {
            $query->whereDate('scheduled_at', $scheduledAt->toDateString());
        })
        ->first();

    if ($notification) {
        return $notification;
    }

    return VetNotification::create([
        'channel' => 'whatsapp',
        'phone' => $phone,
        'title' => $title,
        'message' => $message,
        'status' => 'pending',
        'scheduled_at' => $scheduledAt,
        'whatsapp_url' => $this->buildWhatsAppUrl($phone, $message),
        'related_type' => $relatedType,
        'related_id' => $relatedId,
    ]);
}

    public function generateAppointmentReminders(): Collection
{
    $today = now()->toDateString();

    return Appointment::query()
        ->with(['client', 'pet'])
        ->whereDate('date', $today)
        ->whereIn('status', [
            'scheduled',
            'confirmed',
            'pending',
        ])
        ->orderBy('time')
        ->get()
        ->map(function (Appointment $appointment): VetNotification {

            $pet = $appointment->pet?->name ?? 'Paciente';

            $client = $appointment->client
                ? trim(
                    ($appointment->client->first_name ?? '') .
                    ' ' .
                    ($appointment->client->last_name ?? '')
                )
                : 'Cliente';

            $message = sprintf(
                "📅 Agenda Natural Vet\n\n%s\nPaciente: %s\nCliente: %s\nHora: %s",
                $appointment->service,
                $pet,
                $client,
                substr((string) $appointment->time, 0, 5)
            );

            return $this->createPending(
                'Agenda del día',
                $message,
                now(),
                Appointment::class,
                $appointment->id
            );
        });
}

    private function buildWhatsAppUrl(string $phone, string $message): string
    {
        $digits = preg_replace('/\D+/', '', $phone);

        return 'https://wa.me/'.$digits.'?text='.rawurlencode($message);
    }
    public function generateClosingSummary(): VetNotification
{
    $today = now()->toDateString();

    $scheduled = Appointment::whereDate('date', $today)->count();

    $completed = Appointment::whereDate('date', $today)
        ->where('status', 'completed')
        ->count();

    $pending = Appointment::whereDate('date', $today)
        ->whereIn('status', ['scheduled', 'confirmed', 'pending'])
        ->count();

    $cancelled = Appointment::whereDate('date', $today)
        ->where('status', 'cancelled')
        ->count();

    $message = sprintf(
        "📋 Resumen del día - Natural Vet\n\n".
        "Total de citas: %d\n".
        "Atendidas: %d\n".
        "Pendientes: %d\n".
        "Canceladas: %d",
        $scheduled,
        $completed,
        $pending,
        $cancelled
    );

    return $this->createPending(
        'Resumen diario',
        $message,
        now()
    );
}
}
