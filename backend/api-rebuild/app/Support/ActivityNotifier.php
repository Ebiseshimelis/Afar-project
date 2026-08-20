<?php

namespace App\Support;

use App\Models\Notification;

class ActivityNotifier
{
    public static function created(string $title): void
    {
        self::create(
            "Created: {$title}",
            "A new item was created: {$title}"
        );
    }

    public static function updated(string $title): void
    {
        self::create(
            "Updated: {$title}",
            "An item was updated: {$title}"
        );
    }

    public static function deleted(string $title): void
    {
        self::create(
            "Deleted: {$title}",
            "An item was deleted: {$title}"
        );
    }

    public static function message(string $name): void
    {
        self::create(
            "New message from {$name}",
            "A new contact message was received from {$name}."
        );
    }

    private static function create(string $title, string $body): void
    {
        Notification::create([
            'title' => $title,
            'body' => $body,
            'is_read' => false,
            'type' => 'activity',
        ]);
    }
}
