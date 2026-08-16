<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tender;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Throwable;

class TenderController extends Controller
{
    /**
     * Display a listing of tenders.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Tender::with(['category', 'author']);

            if ($request->boolean('active')) {
                $query->where(function ($q) {
                    $q->whereNull('closes_at')
                        ->orWhere('closes_at', '>=', now());
                });
            }

            $tenders = $query
                ->orderByRaw('closes_at IS NULL ASC')
                ->orderBy('closes_at', 'asc')
                ->paginate($request->integer('per_page', 15));

            return response()->json($tenders, 200);
        } catch (Throwable $e) {
            Log::error('Tender Index Error: ' . $e->getMessage());

            return response()->json([
                'message' => 'Failed to retrieve tenders.',
            ], 500);
        }
    }

    /**
     * Store a newly created tender.
     */
    public function store(Request $request): JsonResponse
    {
        if (!$request->user()?->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $validated = $request->validate([
            'category_id' => [
                'required',
                'exists:categories,id',
            ],

            'title' => [
                'required',
                'array',
            ],

            'content' => [
                'required',
                'array',
            ],

            'file' => [
                'nullable',
                'file',
                'mimes:pdf,doc,docx,jpg,jpeg,png,webp',
                'max:2048',
            ],

            'opens_at' => [
                'nullable',
                'date',
            ],

            'closes_at' => [
                'nullable',
                'date',
                'after:opens_at',
            ],

            'status' => [
                'required',
                'in:draft,published',
            ],
        ]);

        try {
            $payload = [
                'category_id' => $validated['category_id'],
                'created_by' => $request->user()->id,
                'title' => $validated['title'],
                'content' => $validated['content'],
                'opens_at' => $validated['opens_at'] ?? null,
                'closes_at' => $validated['closes_at'] ?? null,
                'status' => $validated['status'],
                'published_at' => $validated['status'] === 'published'
                    ? now()
                    : null,
            ];

            if ($request->hasFile('file')) {
                $payload['file_path'] = $request
                    ->file('file')
                    ->store('tenders', 'public');
            }

            $tender = Tender::create($payload);

            return response()->json([
                'message' => 'Tender created successfully.',
                'data' => $tender->load(['category', 'author']),
            ], 201);
        } catch (Throwable $e) {
            Log::error('Tender Store Error: ' . $e->getMessage());

            return response()->json([
                'message' => 'Failed to create tender.',
            ], 500);
        }
    }

    /**
     * Display the specified tender.
     */
    public function show(Tender $tender): JsonResponse
    {
        return response()->json([
            'data' => $tender->load(['category', 'author']),
        ], 200);
    }

    /**
     * Update the specified tender.
     */
    public function update(
        Request $request,
        Tender $tender
    ): JsonResponse {
        if (!$request->user()?->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $validated = $request->validate([
            'category_id' => [
                'sometimes',
                'exists:categories,id',
            ],

            'title' => [
                'sometimes',
                'array',
            ],

            'content' => [
                'sometimes',
                'array',
            ],

            'file' => [
                'nullable',
                'file',
                'mimes:pdf,doc,docx,jpg,jpeg,png,webp',
                'max:2048',
            ],

            'opens_at' => [
                'nullable',
                'date',
            ],

            'closes_at' => [
                'nullable',
                'date',
                'after:opens_at',
            ],

            'status' => [
                'sometimes',
                'in:draft,published',
            ],
        ]);

        try {
            $payload = [];

            if (array_key_exists('category_id', $validated)) {
                $payload['category_id'] = $validated['category_id'];
            }

            if (array_key_exists('title', $validated)) {
                $payload['title'] = $validated['title'];
            }

            if (array_key_exists('content', $validated)) {
                $payload['content'] = $validated['content'];
            }

            if (array_key_exists('opens_at', $validated)) {
                $payload['opens_at'] = $validated['opens_at'];
            }

            if (array_key_exists('closes_at', $validated)) {
                $payload['closes_at'] = $validated['closes_at'];
            }

            if (array_key_exists('status', $validated)) {
                $payload['status'] = $validated['status'];

                if ($validated['status'] === 'published') {
                    $payload['published_at'] =
                        $tender->published_at ?? now();
                } else {
                    $payload['published_at'] = null;
                }
            }

            if ($request->hasFile('file')) {
                if (
                    $tender->file_path &&
                    Storage::disk('public')->exists($tender->file_path)
                ) {
                    Storage::disk('public')->delete(
                        $tender->file_path
                    );
                }

                $payload['file_path'] = $request
                    ->file('file')
                    ->store('tenders', 'public');
            }

            $tender->update($payload);

            return response()->json([
                'message' => 'Tender updated successfully.',
                'data' => $tender->fresh()->load([
                    'category',
                    'author',
                ]),
            ], 200);
        } catch (Throwable $e) {
            Log::error('Tender Update Error: ' . $e->getMessage());

            return response()->json([
                'message' => 'Failed to update tender.',
            ], 500);
        }
    }

    /**
     * Remove the specified tender.
     */
    public function destroy(Tender $tender): JsonResponse
    {
        if (!request()->user()?->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        try {
            if (
                $tender->file_path &&
                Storage::disk('public')->exists($tender->file_path)
            ) {
                Storage::disk('public')->delete(
                    $tender->file_path
                );
            }

            $tender->delete();

            return response()->json([
                'message' => 'Tender deleted successfully.',
            ], 200);
        } catch (Throwable $e) {
            Log::error('Tender Delete Error: ' . $e->getMessage());

            return response()->json([
                'message' => 'Failed to delete tender.',
            ], 500);
        }
    }
}