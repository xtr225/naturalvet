<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VetNotification extends Model
{
    protected $fillable = [
        'channel',
        'phone',
        'title',
        'message',
        'status',
        'scheduled_at',
        'sent_at',
        'whatsapp_url',
        'related_type',
        'related_id',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'scheduled_at' => 'datetime',
            'sent_at' => 'datetime',
        ];
    }
}
