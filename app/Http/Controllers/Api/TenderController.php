<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tender;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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
        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'title'       => ['required', 'array'],
            'content'     => ['required', 'array'],
            'file_path'   => ['required', 'string'],
            'opens_at'    => ['required', 'date'],
            'closes_at'   => ['required', 'date', 'after:opens_at'],
            'status'      => ['required', 'in:draft,published'],
        ]);

        try {
            $tender = Tender::create([
                ...$validated,
                'created_by' => $request->user()->id,
            ]);

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
        $validated = $request->validate([
            'title'     => ['sometimes', 'array'],
            'content'   => ['sometimes', 'array'],
            'file_path' => ['sometimes', 'string'],
            'closes_at' => ['sometimes', 'date'],
            'status'    => ['sometimes', 'in:draft,published'],
        ]);

        try {
            $tender->update($validated);
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