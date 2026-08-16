<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class FeedbackController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $feedback = Feedback::orderBy('created_at', 'desc')
                ->paginate($request->integer('per_page', 20));

            return response()->json($feedback, 200);
        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to load feedback.',
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'topic' => ['required', 'string', 'max:255'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['required', 'string'],
        ]);

        try {
            $feedback = Feedback::create($validated);

            return response()->json([
                'message' => 'Thank you. Your feedback has been received.',
                'data' => $feedback,
            ], 201);
        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to submit feedback.',
            ], 500);
        }
    }

    public function show(Feedback $feedback): JsonResponse
    {
        if (!$feedback->is_read) {
            $feedback->update(['is_read' => true]);
        }

        return response()->json([
            'data' => $feedback->fresh(),
        ], 200);
    }

    public function destroy(Feedback $feedback): JsonResponse
    {
        try {
            $feedback->delete();

            return response()->json([
                'message' => 'Feedback deleted.',
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to delete feedback.',
            ], 500);
        }
    }
}
