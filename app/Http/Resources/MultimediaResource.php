<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MultimediaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'=>$this->id,
            'title'=>$this->title,
            'description'=>$this->description,
            'type'=>$this->type,
            'file_path'=>$this->file_path,
            'video_url'=>$this->video_url,
            'thumbnail'=>$this->thumbnail,
            'status'=>$this->status,
            'uploaded_by'=>$this->uploaded_by,
            'created_at'=>$this->created_at,
        ];
    }
}
