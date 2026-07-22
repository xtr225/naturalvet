<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MedicalRecord extends Model
{
    protected $fillable = [
        'pet_id',
        'date',
        'reason',
        'diagnosis',
        'treatment',
        'vaccines',
        'attachments',
        'observations',
        'veterinarian',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
        ];
    }

    public function pet(): BelongsTo
    {
        return $this->belongsTo(Pet::class);
    }
}
