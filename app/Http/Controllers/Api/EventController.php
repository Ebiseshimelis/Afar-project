<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'title'       => ['required', 'array'],
            'content'     => ['required', 'array'],
            'start_at'    => ['required', 'date'],
            'end_at'      => ['required', 'date', 'after:start_at'],
            'status'      => ['required', 'in:draft,published'],
        ]);

        try {
            $event = DB::transaction(fn() => Event::create([
                ...$validated,
                'created_by' => $request->user()->id,
            ]));

            return response()->json(['message' => 'Event created.', 'data' => $event], 201);
        } catch (Throwable $e) {
            Log::error('Event Store Error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to create event.'], 500);
        }
    }

    public function show(Event $event): JsonResponse
    {
        return response()->json(['data' => $event->load(['category', 'author', 'media'])], 200);
    }

    public function update(Request $request, Event $event): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => ['sometimes', 'exists:categories,id'],
            'title'       => ['sometimes', 'array'],
            'content'     => ['sometimes', 'array'],
            'start_at'    => ['sometimes', 'date'],
            'end_at'      => ['sometimes', 'date'],
            'status'      => ['sometimes', 'in:draft,published'],
        ]);

        try {
            $event->update($validated);
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