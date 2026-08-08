<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CityAdmin extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'city_administrations';

    protected $fillable = [
        'name',
        'description',
        'mayor_name',
        'location',
        'email',
        'phone',
        'image_path',
    ];

    protected $casts = [
        'name' => 'array',
        'description' => 'array',
    ];
}
