<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Directorate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class DirectorateController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            return response()->json(Directorate::with('category')->get(), 200);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to fetch directorates.'], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'title'       => ['required', 'array'],
            'content'     => ['required', 'array'],
            'file_path'   => ['nullable', 'string'],
        ]);

        try {
            $directorate = Directorate::create($validated);
            return response()->json(['message' => 'Directorate saved.', 'data' => $directorate], 201);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to create directorate.'], 500);
        }
    }

    public function show(Directorate $directorate): JsonResponse
    {
        return response()->json(['data' => $directorate->load('category')], 200);
    }

    public function update(Request $request, Directorate $directorate): JsonResponse
    {
        $validated = $request->validate([
            'title'     => ['sometimes', 'array'],
            'content'   => ['sometimes', 'array'],
            'file_path' => ['nullable', 'string'],
        ]);

        try {
            $directorate->update($validated);
            return response()->json(['message' => 'Directorate updated.', 'data' => $directorate], 200);
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