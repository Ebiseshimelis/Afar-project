<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CityAdmin;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class CityAdminController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            return response()->json(CityAdmin::with('category')->get(), 200);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to fetch city admins.'], 500);
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
            $cityAdmin = CityAdmin::create($validated);
            return response()->json(['message' => 'City Admin created.', 'data' => $cityAdmin], 201);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to save city admin.'], 500);
        }
    }

    public function show(CityAdmin $cityAdmin): JsonResponse
    {
        return response()->json(['data' => $cityAdmin->load('category')], 200);
    }

    public function update(Request $request, CityAdmin $cityAdmin): JsonResponse
    {
        $validated = $request->validate([
            'title'     => ['sometimes', 'array'],
            'content'   => ['sometimes', 'array'],
            'file_path' => ['nullable', 'string'],
        ]);

        try {
            $cityAdmin->update($validated);
            return response()->json(['message' => 'City Admin updated.', 'data' => $cityAdmin], 200);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to update city admin.'], 500);
        }
    }

    public function destroy(CityAdmin $cityAdmin): JsonResponse
    {
        try {
            $cityAdmin->delete();
            return response()->json(['message' => 'City Admin deleted.'], 200);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to delete city admin.'], 500);
        }
    }
}