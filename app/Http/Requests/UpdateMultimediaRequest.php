<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMultimediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type' => ['sometimes', 'in:image,video'],
            'file_path' => ['nullable', 'string'],
            'video_url' => ['nullable', 'string'],
            'thumbnail' => ['nullable', 'string'],
            'status' => ['sometimes', 'in:draft,published'],
        ];
    }
}