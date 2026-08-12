<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'category' => $this->whenLoaded('category') ? [
                'id' => $this->category->id,
                'name' => $this->category->name ?? null,
            ] : null,
            'author' => $this->whenLoaded('author') ? [
                'id' => $this->author->id,
                'name' => $this->author->name ?? null,
            ] : null,
            'title' => $this->title,
            'content' => $this->content,
            'start_at' => $this->start_at?->toIso8601String(),
            'end_at' => $this->end_at?->toIso8601String(),
            'status' => $this->status,
            'published_at' => $this->published_at?->toIso8601String(),
            'media' => $this->whenLoaded('media') ? MediaResource::collection($this->media) : [],
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
