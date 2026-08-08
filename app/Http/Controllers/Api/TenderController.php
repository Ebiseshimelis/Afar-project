<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tender;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Throwable;

class TenderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Tender::with(['category', 'author']);

            if ($request->has('active')) {
                $query->where('closes_at', '>=', now());
            }

            $tenders = $query->orderBy('closes_at', 'asc')
                ->paginate($request->integer('per_page', 15));

            return response()->json($tenders, 200);
        } catch (Throwable $e) {
            Log::error('Tender Index Error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to retrieve tenders.'], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        if (!$request->user()?->isAdmin()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'title'       => ['required', 'array'],
            'content'     => ['required', 'array'],
            'file'        => ['nullable', 'file', 'mimes:pdf,doc,docx,jpg,jpeg,png,webp', 'max:2048'],
            'opens_at'    => ['required', 'date'],
            'closes_at'   => ['required', 'date', 'after:opens_at'],
            'status'      => ['required', 'in:draft,published'],
        ]);

        try {
            $payload = [
                ...$validated,
                'created_by' => $request->user()->id,
            ];

            if ($request->hasFile('file')) {
                $payload['file_path'] = $request->file('file')->store('tenders', 'public');
            }

            $tender = Tender::create($payload);

            return response()->json(['message' => 'Tender published.', 'data' => $tender], 201);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to store tender.'], 500);
        }
    }

    public function show(Tender $tender): JsonResponse
    {
        return response()->json(['data' => $tender->load(['category', 'author'])], 200);
    }

    public function update(Request $request, Tender $tender): JsonResponse
    {
        if (!$request->user()?->isAdmin()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $validated = $request->validate([
            'title'     => ['sometimes', 'array'],
            'content'   => ['sometimes', 'array'],
            'file'      => ['nullable', 'file', 'mimes:pdf,doc,docx,jpg,jpeg,png,webp', 'max:2048'],
            'closes_at' => ['sometimes', 'date'],
            'status'    => ['sometimes', 'in:draft,published'],
        ]);

        try {
            $payload = $validated;

            if ($request->hasFile('file')) {
                if ($tender->file_path && Storage::disk('public')->exists($tender->file_path)) {
                    Storage::disk('public')->delete($tender->file_path);
                }

                $payload['file_path'] = $request->file('file')->store('tenders', 'public');
            }

            $tender->update($payload);
            return response()->json(['message' => 'Tender updated.', 'data' => $tender], 200);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to update tender.'], 500);
        }
    }

    public function destroy(Tender $tender): JsonResponse
    {
        try {
            $tender->delete();
            return response()->json(['message' => 'Tender deleted.'], 200);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to delete tender.'], 500);
        }
    }
}