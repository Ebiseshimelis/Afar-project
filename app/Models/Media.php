<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Media extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'mediable_type',
        'mediable_id',
        'path',
        'type',
        'sort_order',
    ];

    public function mediable(): MorphTo
    {
        return $this->morphTo();
    }
}