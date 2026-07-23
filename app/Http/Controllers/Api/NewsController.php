<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class NewsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $query = News::with(['category', 'author']);

            if ($request->has('category_id')) {
                $query->where('category_id', $request->integer('category_id'));
            }

            if ($request->has('status')) {
                $query->where('status', $request->string('status'));
            } else if (!$request->user()) {
                $query->where('status', 'published');
            }

            $sortOrder = strtolower($request->get('sort', 'desc')) === 'asc' ? 'asc' : 'desc';
            $news = $query->orderBy('published_at', $sortOrder)
                ->paginate($request->integer('per_page', 15));

            return response()->json($news, 200);
        } catch (Throwable $e) {
            Log::error('News Index Error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to retrieve news.'], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id'  => ['required', 'exists:categories,id'],
            'title'        => ['required', 'array'],
            'title.en'     => ['required', 'string', 'max:255'],
            'title.am'     => ['required', 'string', 'max:255'],
            'content'      => ['required', 'array'],
            'content.en'   => ['required', 'string'],
            'content.am'   => ['required', 'string'],
            'status'       => ['required', 'in:draft,published'],
            'published_at' => ['nullable', 'date'],
        ]);

        try {
            $news = DB::transaction(fn() => News::create([
                ...$validated,
                'created_by' => $request->user()->id,
            ]));

            return response()->json(['message' => 'News created successfully.', 'data' => $news->load(['category', 'author'])], 201);
        } catch (Throwable $e) {
            Log::error('News Store Error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to create news.'], 500);
        }
    }

    public function show(News $news): JsonResponse
    {
        return response()->json(['data' => $news->load(['category', 'author', 'media'])], 200);
    }

    public function update(Request $request, News $news): JsonResponse
    {
        $validated = $request->validate([
            'category_id'  => ['sometimes', 'exists:categories,id'],
            'title'        => ['sometimes', 'array'],
            'content'      => ['sometimes', 'array'],
            'status'       => ['sometimes', 'in:draft,published'],
            'published_at' => ['nullable', 'date'],
        ]);

        try {
            DB::transaction(fn() => $news->update($validated));
            return response()->json(['message' => 'News updated successfully.', 'data' => $news->fresh(['category', 'author'])], 200);
        } catch (Throwable $e) {
            Log::error('News Update Error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to update news.'], 500);
        }
    }

    public function destroy(News $news): JsonResponse
    {
        try {
            $news->delete();
            return response()->json(['message' => 'News deleted successfully.'], 200);
        } catch (Throwable $e) {
            Log::error('News Delete Error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to delete news.'], 500);
        }
    }
}