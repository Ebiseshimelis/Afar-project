<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Publication;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class PublicationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $publications = Publication::with(['category', 'author'])
                ->orderBy('created_at', 'desc')
                ->paginate($request->integer('per_page', 15));

            return response()->json($publications, 200);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to fetch publications.'], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'title'       => ['required', 'array'],
            'content'     => ['nullable', 'array'],
            'file_path'   => ['required', 'string'],
            'status'      => ['required', 'in:draft,published'],
        ]);

        try {
            $pub = Publication::create([
                ...$validated,
                'created_by' => $request->user()->id,
            ]);

            return response()->json(['message' => 'Publication uploaded.', 'data' => $pub], 201);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to save publication.'], 500);
        }
    }

    public function show(Publication $publication): JsonResponse
    {
        return response()->json(['data' => $publication->load(['category', 'author'])], 200);
    }

    public function update(Request $request, Publication $publication): JsonResponse
    {
        $validated = $request->validate([
            'title'     => ['sometimes', 'array'],
            'file_path' => ['sometimes', 'string'],
            'status'    => ['sometimes', 'in:draft,published'],
        ]);

        try {
            $publication->update($validated);
            return response()->json(['message' => 'Publication updated.', 'data' => $publication], 200);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to update publication.'], 500);
        }
    }

    public function destroy(Publication $publication): JsonResponse
    {
        try {
            $publication->delete();
            return response()->json(['message' => 'Publication deleted.'], 200);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to delete publication.'], 500);
        }
    }
}