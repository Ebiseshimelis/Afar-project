<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class MultimediaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $filePath = $this->file_path;

        /*
         * If file_path is already an external URL,
         * return it unchanged.
         */
        if (
            $filePath
            && filter_var($filePath, FILTER_VALIDATE_URL)
        ) {
            $fileUrl = $filePath;
        } elseif ($filePath) {
            /*
             * Local uploaded file.
             *
             * This produces:
             * http://127.0.0.1:8000/storage/multimedia/...
             */
            $fileUrl = Storage::disk('public')->url($filePath);
        } else {
            $fileUrl = null;
        }

        /*
         * video_url is already a URL.
         */
        $videoUrl = $this->video_url;

        return [
            'id' => $this->id,

            'title' => $this->title,

            'description' => $this->description,

            'type' => $this->type,

            /*
             * Original database path.
             */
            'file_path' => $this->file_path,

            /*
             * Browser-ready URL.
             */
            'file_url' => $fileUrl,

            'video_url' => $videoUrl,

            'thumbnail' => $this->thumbnail,

            'status' => $this->status,

            'published_at' => $this->published_at,

            'uploaded_by' => $this->uploaded_by,

            'created_at' => $this->created_at,

            'updated_at' => $this->updated_at,
        ];
    }
}
