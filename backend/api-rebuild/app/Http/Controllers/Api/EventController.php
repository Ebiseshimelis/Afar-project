<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Models\Event;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Throwable;

class EventController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Event::with(['category', 'author']);

            if ($request->has('category_id')) {
                $query->where('category_id', $request->integer('category_id'));
            }

            if ($request->has('upcoming')) {
                $query->where('start_at', '>=', now());
            }

            $events = $query->orderBy('start_at', 'asc')
                ->paginate($request->integer('per_page', 15));

            return response()->json($events, 200);
        } catch (Throwable $e) {
            Log::error('Event Index Error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to retrieve events.'], 500);
        }
    }

    public function store(StoreEventRequest $request): JsonResponse
    {
        if (!$request->user()?->isAdmin()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $validated = $request->validated();

        try {
            $payload = [
                ...$validated,
                'created_by' => $request->user()->id,
            ];

            if ($request->hasFile('image')) {
                $payload['image_path'] = $request->file('image')->store('events', 'public');
            }

            $event = DB::transaction(fn() => Event::create($payload));

            return response()->json(['message' => 'Event created.', 'data' => $event], 201);
        } catch (Throwable $e) {
            Log::error('Event Store Error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to create event.'], 500);
        }
    }

    public function show(Event $event): JsonResponse
    {
        return response()->json(['data' => $event->load(['category', 'author'])], 200);
    }

    public function update(UpdateEventRequest $request, Event $event): JsonResponse
    {
        if (!$request->user()?->isAdmin()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $validated = $request->validated();

        try {
            $payload = $validated;

            if ($request->hasFile('image')) {
                if ($event->image_path && Storage::disk('public')->exists($event->image_path)) {
                    Storage::disk('public')->delete($event->image_path);
                }

                $payload['image_path'] = $request->file('image')->store('events', 'public');
            }

            $event->update($payload);
            return response()->json(['message' => 'Event updated.', 'data' => $event], 200);
        } catch (Throwable $e) {
            Log::error('Event Update Error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to update event.'], 500);
        }
    }

    public function destroy(Event $event): JsonResponse
    {
        try {
            $event->delete();
            return response()->json(['message' => 'Event deleted.'], 200);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to delete event.'], 500);
        }
    }
}
