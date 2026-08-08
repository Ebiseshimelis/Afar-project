<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreNewsRequest;
use App\Http\Requests\UpdateNewsRequest;
use App\Models\News;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
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

    public function store(StoreNewsRequest $request): JsonResponse
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
                $payload['image_path'] = $request->file('image')->store('news', 'public');
            }

            $news = DB::transaction(fn() => News::create($payload));

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

    public function update(UpdateNewsRequest $request, News $news): JsonResponse
    {
        if (!$request->user()?->isAdmin()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $validated = $request->validated();

        try {
            $payload = $validated;

            if ($request->hasFile('image')) {
                if ($news->image_path && Storage::disk('public')->exists($news->image_path)) {
                    Storage::disk('public')->delete($news->image_path);
                }

                $payload['image_path'] = $request->file('image')->store('news', 'public');
            }

            DB::transaction(fn() => $news->update($payload));
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