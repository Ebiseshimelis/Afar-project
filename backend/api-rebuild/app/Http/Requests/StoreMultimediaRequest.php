<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMultimediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type' => ['required', 'in:image,video'],
            'file_path' => ['nullable', 'string'],
            'video_url' => ['nullable', 'string'],
            'thumbnail' => ['nullable', 'string'],
            'status' => ['required', 'in:draft,published'],
        ];
    }
}