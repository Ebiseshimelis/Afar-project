<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class About extends Model
{
    protected $fillable = [
        'mission',
        'vision',
        'values',
        'description',
        'services',
        'image',
    ];

    protected $casts = [
        'services' => 'array',
    ];
}