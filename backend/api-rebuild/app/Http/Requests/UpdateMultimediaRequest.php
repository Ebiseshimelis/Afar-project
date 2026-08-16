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
            'title' => [
                'sometimes',
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'type' => [
                'sometimes',
                'required',
                'in:image,video',
            ],

            /*
             * Maximum video upload size:
             *
             * 204800 KB = 200 MB
             */
            'file' => [
                'nullable',
                'file',
                'mimes:jpg,jpeg,png,gif,webp,mp4,mov,avi,webm',
                'max:204800',
            ],

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
                'sometimes',
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
            $type = $this->input(
                'type',
                $this->route('multimedia')?->type
            );

            $hasFile = $this->hasFile('file');
            $hasMediaUrl = filled($this->input('media_url'));
            $hasVideoUrl = filled($this->input('video_url'));

            if ($type === 'image') {
                if (
                    !$hasFile &&
                    !$hasMediaUrl &&
                    !$this->route('multimedia')?->file_path
                ) {
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
                if (
                    !$hasFile &&
                    !$hasVideoUrl &&
                    !$this->route('multimedia')?->file_path &&
                    !$this->route('multimedia')?->video_url
                ) {
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
