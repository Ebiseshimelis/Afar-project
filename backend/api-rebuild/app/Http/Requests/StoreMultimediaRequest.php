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
            'title' => [
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'type' => [
                'required',
                'in:image,video',
            ],

            /*
             * A file is optional because the admin can
             * provide a URL instead.
             *
             * 204800 KB = 200 MB.
             */
            'file' => [
                'nullable',
                'file',
                'mimes:jpg,jpeg,png,gif,webp,mp4,mov,avi,webm',
                'max:204800',
            ],

            /*
             * Used for:
             * - video URL
             * - image URL
             *
             * The controller stores an image URL in
             * file_path because the existing database
             * does not have a separate image_url column.
             */
            'media_url' => [
                'nullable',
                'url',
                'max:2048',
            ],

            'video_url' => [
                'nullable',
                'url',
                'max:2048',
            ],

            'thumbnail' => [
                'nullable',
                'string',
                'max:2048',
            ],

            'status' => [
                'required',
                'in:draft,published',
            ],

            'published_at' => [
                'nullable',
                'date',
            ],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $type = $this->input('type');

            $hasFile = $this->hasFile('file');
            $hasMediaUrl = filled($this->input('media_url'));
            $hasVideoUrl = filled($this->input('video_url'));

            if ($type === 'image') {
                if (!$hasFile && !$hasMediaUrl) {
                    $validator->errors()->add(
                        'file',
                        'Please upload an image file or provide an image URL.'
                    );
                }

                if ($hasVideoUrl) {
                    $validator->errors()->add(
                        'video_url',
                        'Video URL is not allowed for an image.'
                    );
                }
            }

            if ($type === 'video') {
                if (!$hasFile && !$hasVideoUrl) {
                    $validator->errors()->add(
                        'file',
                        'Please upload a video file or provide a video URL.'
                    );
                }

                if ($hasFile) {
                    $mime = $this->file('file')->getMimeType();

                    if (
                        $mime &&
                        !str_starts_with($mime, 'video/')
                    ) {
                        $validator->errors()->add(
                            'file',
                            'The selected file must be a video.'
                        );
                    }
                }
            }
        });
    }
}
