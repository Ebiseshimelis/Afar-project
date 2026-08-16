<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $notifications = Notification::orderBy('created_at', 'desc')
                ->paginate($request->integer('per_page', 20));

            return response()->json($notifications, 200);
        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to load notifications.'
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => ['required', 'string', 'max:50'],
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'is_read' => ['sometimes', 'boolean'],
        ]);

        try {
            $notification = Notification::create($validated);

            return response()->json([
                'message' => 'Notification created successfully.',
                'data' => $notification,
            ], 201);
        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to create notification.'
            ], 500);
        }
    }

    public function show(Notification $notification): JsonResponse
    {
        return response()->json([
            'data' => $notification
        ], 200);
    }

    public function markAsRead(Notification $notification): JsonResponse
    {
        try {
            $notification->update([
                'is_read' => true,
            ]);

            return response()->json([
                'message' => 'Notification marked as read.',
                'data' => $notification->fresh(),
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to mark notification as read.'
            ], 500);
        }
    }

    public function markAllAsRead(): JsonResponse
    {
        try {
            Notification::where('is_read', false)->update([
                'is_read' => true,
            ]);

            return response()->json([
                'message' => 'All notifications marked as read.'
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to mark notifications as read.'
            ], 500);
        }
    }

    public function destroy(Notification $notification): JsonResponse
    {
        try {
            $notification->delete();

            return response()->json([
                'message' => 'Notification deleted.'
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to delete notification.'
            ], 500);
        }
    }
}
