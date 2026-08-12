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
    public function index(): JsonResponse
    {
        try {
            return response()->json(['data' => Directorate::orderBy('sort_order')->get()], 200);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to fetch directorates.'], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        if (!$request->user()?->isAdmin()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $validated = $request->validate([
            'name' => ['required', 'array'],
            'description' => ['nullable', 'array'],
            'head_name' => ['nullable', 'array'],
            'head_title' => ['nullable', 'array'],
            'email' => ['nullable', 'email'],
            'phone' => ['nullable', 'string', 'max:50'],
            'sort_order' => ['nullable', 'integer'],
            'photo' => ['nullable', 'image', 'max:2048'],
        ]);

        try {
            $payload = [
                ...$validated,
            ];
            unset($payload['photo']);

            if ($request->hasFile('photo')) {
                $payload['photo_path'] = $request->file('photo')->store('directorates', 'public');
            }

            $directorate = Directorate::create($payload);
            return response()->json(['message' => 'Directorate saved.', 'data' => $directorate], 201);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to create directorate.'], 500);
        }
    }

    public function show(Directorate $directorate): JsonResponse
    {
        return response()->json(['data' => $directorate], 200);
    }

    public function update(Request $request, Directorate $directorate): JsonResponse
    {
        if (!$request->user()?->isAdmin()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'array'],
            'description' => ['nullable', 'array'],
            'head_name' => ['nullable', 'array'],
            'head_title' => ['nullable', 'array'],
            'email' => ['nullable', 'email'],
            'phone' => ['nullable', 'string', 'max:50'],
            'sort_order' => ['nullable', 'integer'],
            'photo' => ['nullable', 'image', 'max:2048'],
        ]);

        try {
            $payload = $validated;
            unset($payload['photo']);

            if ($request->hasFile('photo')) {
                if ($directorate->photo_path && Storage::disk('public')->exists($directorate->photo_path)) {
                    Storage::disk('public')->delete($directorate->photo_path);
                }
                $payload['photo_path'] = $request->file('photo')->store('directorates', 'public');
            }

            $directorate->update($payload);
            return response()->json(['message' => 'Directorate updated.', 'data' => $directorate->fresh()], 200);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to update directorate.'], 500);
        }
    }

    public function destroy(Directorate $directorate): JsonResponse
    {
        try {
            $directorate->delete();
            return response()->json(['message' => 'Directorate deleted.'], 200);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to delete directorate.'], 500);
        }
    }
}
