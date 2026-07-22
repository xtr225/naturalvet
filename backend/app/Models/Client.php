<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    protected $fillable = [
        'first_name',
        'last_name',
        'document',
        'phone',
        'email',
        'address',
        'status',
        'notes',
    ];

    protected $appends = ['full_name', 'pets_count'];

    public function pets(): HasMany
    {
        return $this->hasMany(Pet::class);
    }

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function getPetsCountAttribute(): int
    {
        return $this->relationLoaded('pets') ? $this->pets->count() : $this->pets()->count();
    }
}
