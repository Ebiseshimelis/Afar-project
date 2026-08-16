<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Multimedia extends Model
{
    protected $table = 'multimedia';

    protected $fillable = [
        'title',
        'description',
        'type',
        'file_path',
        'video_url',
        'thumbnail',
        'status',
        'published_at',
        'uploaded_by',
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}