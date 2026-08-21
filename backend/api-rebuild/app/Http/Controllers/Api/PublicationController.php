<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Publication;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
            return response()->json([
                'message' => 'Failed to fetch publications.'
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        if (!$request->user()?->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized.'
            ], 403);
        }

        $validated = $request->validate([
            'category_id' => [
                'required',
                'exists:categories,id'
            ],

            'title' => [
                'required',
                'array'
            ],

            'description' => [
                'nullable',
                'array'
            ],

            'file' => [
                'nullable',
                'file',
                'mimes:pdf,doc,docx,jpg,jpeg,png,webp',
                'max:2048'
            ],

            'status' => [
                'required',
                'in:draft,published'
            ],

            'published_at' => [
                'nullable',
                'date'
            ],
        ]);

        try {
            $payload = [
                'category_id' => $validated['category_id'],
                'created_by' => $request->user()->id,
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'status' => $validated['status'],
                'published_at' => $validated['published_at'] ?? null,
            ];

            if ($request->hasFile('file')) {
                $file = $request->file('file');

                $payload['file_path'] = $file->store(
                    'publications',
                    'public'
                );

                $payload['file_type'] = $file->getClientOriginalExtension();
                $payload['file_size'] = $file->getSize();
            }

            $publication = Publication::create($payload);

            return response()->json([
                'message' => 'Publication uploaded.',
                'data' => $publication->load(['category', 'author'])
            ], 201);

        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to save publication.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Publication $publication): JsonResponse
    {
        return response()->json([
            'data' => $publication->load(['category', 'author'])
        ], 200);
    }

    public function update(
        Request $request,
        Publication $publication
    ): JsonResponse {
        if (!$request->user()?->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized.'
            ], 403);
        }

        $validated = $request->validate([
            'category_id' => [
                'sometimes',
                'exists:categories,id'
            ],

            'title' => [
                'sometimes',
                'array'
            ],

            'description' => [
                'sometimes',
                'nullable',
                'array'
            ],

            'file' => [
                'nullable',
                'file',
                'mimes:pdf,doc,docx,jpg,jpeg,png,webp',
                'max:2048'
            ],

            'status' => [
                'sometimes',
                'in:draft,published'
            ],

            'published_at' => [
                'sometimes',
                'nullable',
                'date'
            ],
        ]);

        try {
            $payload = [];

            foreach ([
                'category_id',
                'title',
                'description',
                'status',
                'published_at'
            ] as $field) {
                if (array_key_exists($field, $validated)) {
                    $payload[$field] = $validated[$field];
                }
            }

            if ($request->hasFile('file')) {
                if (
                    $publication->file_path &&
                    Storage::disk('public')->exists(
                        $publication->file_path
                    )
                ) {
                    Storage::disk('public')->delete(
                        $publication->file_path
                    );
                }

                $file = $request->file('file');

                $payload['file_path'] = $file->store(
                    'publications',
                    'public'
                );

                $payload['file_type'] =
                    $file->getClientOriginalExtension();

                $payload['file_size'] =
                    $file->getSize();
            }

            $publication->update($payload);

            return response()->json([
                'message' => 'Publication updated.',
                'data' => $publication->fresh()->load([
                    'category',
                    'author'
                ])
            ], 200);

        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to update publication.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Request $request, Publication $publication): JsonResponse
    {
        if (!$request->user()?->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized.'
            ], 403);
        }

        try {
            if (
                $publication->file_path &&
                Storage::disk('public')->exists(
                    $publication->file_path
                )
            ) {
                Storage::disk('public')->delete(
                    $publication->file_path
                );
            }

            $publication->delete();

            return response()->json([
                'message' => 'Publication deleted.'
            ], 200);

        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to delete publication.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

