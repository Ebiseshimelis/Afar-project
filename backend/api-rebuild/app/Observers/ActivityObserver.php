<?php

namespace App\Observers;

use App\Support\ActivityNotifier;
use Illuminate\Database\Eloquent\Model;

class ActivityObserver
{
    public function created(Model $model): void
    {
        ActivityNotifier::created($this->getTitle($model));
    }

    public function updated(Model $model): void
    {
        ActivityNotifier::updated($this->getTitle($model));
    }

    public function deleted(Model $model): void
    {
        ActivityNotifier::deleted($this->getTitle($model));
    }

    private function getTitle(Model $model): string
    {
        $titleFields = [
            'title',
            'name',
            'full_name',
            'subject',
            'position',
        ];

        foreach ($titleFields as $field) {
            $value = $model->getAttribute($field);

            if (is_string($value) && trim($value) !== '') {
                return trim($value);
            }
        }

        return class_basename($model) . ' #' . $model->getKey();
    }
}
