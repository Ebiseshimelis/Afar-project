<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Directorate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Throwable;

class DirectorateController extends Controller
{
    /**
     * Get all directorates.
     */
    public function index(): JsonResponse
    {
        try {
            $directorates = Directorate::orderBy('sort_order')->get();

            return response()->json([
                'data' => $directorates,
            ], 200);

        } catch (Throwable $e) {
            \Log::error('Failed to fetch directorates', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'message' => 'Failed to fetch directorates.',
            ], 500);
        }
    }

    /**
     * Create a directorate.
     */
    public function store(Request $request): JsonResponse
    {
        if (!$request->user()?->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        try {
            $validated = $request->validate([
                'name' => ['required', 'array'],
                'name.en' => ['required', 'string', 'max:255'],
                'name.am' => ['nullable', 'string', 'max:255'],

                'description' => ['nullable', 'array'],
                'description.en' => ['nullable', 'string'],
                'description.am' => ['nullable', 'string'],

                'head_name' => ['nullable', 'array'],
                'head_name.en' => ['nullable', 'string', 'max:255'],
                'head_name.am' => ['nullable', 'string', 'max:255'],

                'head_title' => ['nullable', 'array'],
                'head_title.en' => ['nullable', 'string', 'max:255'],
                'head_title.am' => ['nullable', 'string', 'max:255'],

                'email' => ['nullable', 'email', 'max:255'],
                'phone' => ['nullable', 'string', 'max:50'],
                'sort_order' => ['nullable', 'integer'],

                'photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
                'background' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            ]);

            $payload = [
                'name' => $validated['name'],

                'description' => $validated['description'] ?? [
                    'en' => null,
                    'am' => null,
                ],

                'head_name' => $validated['head_name'] ?? [
                    'en' => null,
                    'am' => null,
                ],

                'head_title' => $validated['head_title'] ?? [
                    'en' => null,
                    'am' => null,
                ],

                'email' => $validated['email'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'sort_order' => $validated['sort_order'] ?? 0,
            ];

            /*
             * Save uploaded director photo.
             */
            if ($request->hasFile('photo')) {
                $payload['photo_path'] = $request
                    ->file('photo')
                    ->store('directorates', 'public');
            }

            /*
             * Save uploaded directorate background.
             */
            if ($request->hasFile('background')) {
                $payload['background_image'] = $request
                    ->file('background')
                    ->store('directorates/backgrounds', 'public');
            }

            $directorate = Directorate::create($payload);

            return response()->json([
                'message' => 'Directorate created successfully.',
                'data' => $directorate,
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            throw $e;

        } catch (Throwable $e) {
            \Log::error('Failed to create directorate', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'request' => $request->except(['photo', 'background']),
            ]);

            return response()->json([
                'message' => 'Failed to create directorate.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get one directorate.
     */
    public function show(Directorate $directorate): JsonResponse
    {
        return response()->json([
            'data' => $directorate,
        ], 200);
    }

    /**
     * Update a directorate.
     */
    public function update(
        Request $request,
        Directorate $directorate
    ): JsonResponse {
        if (!$request->user()?->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        try {
            $validated = $request->validate([
                'name' => ['sometimes', 'array'],
                'name.en' => ['sometimes', 'required', 'string', 'max:255'],
                'name.am' => ['nullable', 'string', 'max:255'],

                'description' => ['nullable', 'array'],
                'description.en' => ['nullable', 'string'],
                'description.am' => ['nullable', 'string'],

                'head_name' => ['nullable', 'array'],
                'head_name.en' => ['nullable', 'string', 'max:255'],
                'head_name.am' => ['nullable', 'string', 'max:255'],

                'head_title' => ['nullable', 'array'],
                'head_title.en' => ['nullable', 'string', 'max:255'],
                'head_title.am' => ['nullable', 'string', 'max:255'],

                'email' => ['nullable', 'email', 'max:255'],
                'phone' => ['nullable', 'string', 'max:50'],
                'sort_order' => ['nullable', 'integer'],

                'photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
                'background' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            ]);

            $payload = [];

            if (array_key_exists('name', $validated)) {
                $payload['name'] = $validated['name'];
            }

            if (array_key_exists('description', $validated)) {
                $payload['description'] = $validated['description'];
            }

            if (array_key_exists('head_name', $validated)) {
                $payload['head_name'] = $validated['head_name'];
            }

            if (array_key_exists('head_title', $validated)) {
                $payload['head_title'] = $validated['head_title'];
            }

            if (array_key_exists('email', $validated)) {
                $payload['email'] = $validated['email'];
            }

            if (array_key_exists('phone', $validated)) {
                $payload['phone'] = $validated['phone'];
            }

            if (array_key_exists('sort_order', $validated)) {
                $payload['sort_order'] = $validated['sort_order'];
            }

            /*
             * Replace old photo if a new one was uploaded.
             */
            if ($request->hasFile('photo')) {
                if (
                    $directorate->photo_path &&
                    Storage::disk('public')->exists($directorate->photo_path)
                ) {
                    Storage::disk('public')->delete(
                        $directorate->photo_path
                    );
                }

                $payload['photo_path'] = $request
                    ->file('photo')
                    ->store('directorates', 'public');
            }

            /*
             * Replace old background if a new one was uploaded.
             */
            if ($request->hasFile('background')) {
                if (
                    $directorate->background_image &&
                    Storage::disk('public')->exists($directorate->background_image)
                ) {
                    Storage::disk('public')->delete(
                        $directorate->background_image
                    );
                }

                $payload['background_image'] = $request
                    ->file('background')
                    ->store('directorates/backgrounds', 'public');
            }

            $directorate->update($payload);

            return response()->json([
                'message' => 'Directorate updated successfully.',
                'data' => $directorate->fresh(),
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            throw $e;

        } catch (Throwable $e) {
            \Log::error('Failed to update directorate', [
                'directorate_id' => $directorate->id,
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'message' => 'Failed to update directorate.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete a directorate.
     */
    public function destroy(
        Request $request,
        Directorate $directorate
    ): JsonResponse {
        if (!$request->user()?->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        try {
            /*
             * Delete the photo from storage before deleting
             * the database record.
             */
            if (
                $directorate->photo_path &&
                Storage::disk('public')->exists($directorate->photo_path)
            ) {
                Storage::disk('public')->delete(
                    $directorate->photo_path
                );
            }

            /*
             * Delete the background from storage before deleting
             * the database record.
             */
            if (
                $directorate->background_image &&
                Storage::disk('public')->exists($directorate->background_image)
            ) {
                Storage::disk('public')->delete(
                    $directorate->background_image
                );
            }

            $directorate->delete();

            return response()->json([
                'message' => 'Directorate deleted successfully.',
            ], 200);

        } catch (Throwable $e) {
            \Log::error('Failed to delete directorate', [
                'directorate_id' => $directorate->id,
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'message' => 'Failed to delete directorate.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}

