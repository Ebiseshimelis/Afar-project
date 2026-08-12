<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CityAdmin;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Throwable;

class CityAdminController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            return response()->json(['data' => CityAdmin::orderBy('name_en')->get()], 200);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to fetch city admins.'], 500);
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
            'mayor_name' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email'],
            'phone' => ['nullable', 'string', 'max:50'],
            'image' => ['nullable', 'image', 'max:2048'],
        ]);

        try {
            $payload = $validated;
            if ($request->hasFile('image')) {
                $payload['image_path'] = $request->file('image')->store('city-admins', 'public');
            }
            unset($payload['image']);
            $cityAdmin = CityAdmin::create($payload);
            return response()->json(['message' => 'City Admin created.', 'data' => $cityAdmin], 201);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to save city admin.'], 500);
        }
    }

    public function show(CityAdmin $cityAdmin): JsonResponse
    {
        return response()->json(['data' => $cityAdmin], 200);
    }

    public function update(Request $request, CityAdmin $cityAdmin): JsonResponse
    {
        if (!$request->user()?->isAdmin()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'array'],
            'description' => ['nullable', 'array'],
            'mayor_name' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email'],
            'phone' => ['nullable', 'string', 'max:50'],
            'image' => ['nullable', 'image', 'max:2048'],
        ]);

        try {
            $payload = $validated;
            if ($request->hasFile('image')) {
                if ($cityAdmin->image_path && Storage::disk('public')->exists($cityAdmin->image_path)) {
                    Storage::disk('public')->delete($cityAdmin->image_path);
                }
                $payload['image_path'] = $request->file('image')->store('city-admins', 'public');
            }
            unset($payload['image']);
            $cityAdmin->update($payload);
            return response()->json(['message' => 'City Admin updated.', 'data' => $cityAdmin->fresh()], 200);
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
