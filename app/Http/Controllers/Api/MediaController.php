<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Throwable;

class MediaController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'file'          => ['required', 'file', 'max:10240'], // Max 10MB
            'mediable_type' => ['required', 'string'],
            'mediable_id'   => ['required', 'integer'],
            'type'          => ['required', 'in:image,document,video'],
        ]);

        try {
            $path = $request->file('file')->store('uploads/media', 'public');

            $media = Media::create([
                'mediable_type' => $request->string('mediable_type'),
                'mediable_id'   => $request->integer('mediable_id'),
                'path'          => $path,
                'type'          => $request->string('type'),
            ]);

            return response()->json(['message' => 'Media uploaded.', 'data' => $media], 201);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to upload media.'], 500);
        }
    }

    public function destroy(Media $media): JsonResponse
    {
        try {
            if (Storage::disk('public')->exists($media->path)) {
                Storage::disk('public')->delete($media->path);
            }

            $media->delete();
            return response()->json(['message' => 'Media deleted.'], 200);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to delete media.'], 500);
        }
    }
}