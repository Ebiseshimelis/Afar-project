<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreNewsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => [
                'required',
                'exists:categories,id',
            ],

            'title' => [
                'required',
                'array',
            ],

            'title.en' => [
                'required',
                'string',
                'max:255',
            ],

            'title.am' => [
                'required',
                'string',
                'max:255',
            ],

            'content' => [
                'required',
                'array',
            ],

            'content.en' => [
                'required',
                'string',
            ],

            'content.am' => [
                'required',
                'string',
            ],

            'status' => [
                'required',
                'in:draft,published',
            ],

            'published_at' => [
                'nullable',
                'date',
            ],

            'image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],
        ];
    }
}