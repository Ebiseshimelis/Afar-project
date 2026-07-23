<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class AnnouncementController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $announcements = Announcement::with('author')
                ->where('status', 'published')
                ->orderBy('published_at', 'desc')
                ->paginate($request->integer('per_page', 15));

            return response()->json($announcements, 200);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to fetch announcements.'], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'        => ['required', 'array'],
            'content'      => ['required', 'array'],
            'status'       => ['required', 'in:draft,published'],
            'published_at' => ['nullable', 'date'],
        ]);

        try {
            $announcement = Announcement::create([
                ...$validated,
                'created_by' => $request->user()->id,
            ]);

            return response()->json(['message' => 'Announcement posted.', 'data' => $announcement], 201);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to post announcement.'], 500);
        }
    }

    public function show(Announcement $announcement): JsonResponse
    {
        return response()->json(['data' => $announcement->load('author')], 200);
    }

    public function update(Request $request, Announcement $announcement): JsonResponse
    {
        $validated = $request->validate([
            'title'   => ['sometimes', 'array'],
            'content' => ['sometimes', 'array'],
            'status'  => ['sometimes', 'in:draft,published'],
        ]);

        try {
            $announcement->update($validated);
            return response()->json(['message' => 'Announcement updated.', 'data' => $announcement], 200);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to update announcement.'], 500);
        }
    }

    public function destroy(Announcement $announcement): JsonResponse
    {
        try {
            $announcement->delete();
            return response()->json(['message' => 'Announcement deleted.'], 200);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to delete announcement.'], 500);
        }
    }
}