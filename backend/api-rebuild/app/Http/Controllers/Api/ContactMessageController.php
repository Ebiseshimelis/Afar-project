<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Support\ActivityNotifier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class ContactMessageController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $messages = ContactMessage::orderBy('created_at', 'desc')
                ->paginate($request->integer('per_page', 20));

            return response()->json($messages, 200);
        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to load contact messages.'
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string'],
        ]);

        try {
            $msg = ContactMessage::create($validated);

            ActivityNotifier::message($msg->full_name);

            return response()->json([
                'message' => 'Thank you. Your message has been received.'
            ], 201);

        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to submit contact message.'
            ], 500);
        }
    }

    public function show(ContactMessage $contactMessage): JsonResponse
    {
        if (!$contactMessage->is_read) {
            $contactMessage->update(['is_read' => true]);
        }

        return response()->json([
            'data' => $contactMessage
        ], 200);
    }

    public function destroy(ContactMessage $contactMessage): JsonResponse
    {
        try {
            $contactMessage->delete();

            return response()->json([
                'message' => 'Message deleted.'
            ], 200);

        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to delete message.'
            ], 500);
        }
    }
}
