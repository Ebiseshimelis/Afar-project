<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class CategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Category::query();

            if ($request->has('type')) {
                $query->where('type', $request->string('type'));
            }

            return response()->json($query->get(), 200);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to fetch categories.'], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => ['required', 'in:directorate,city_admin,general'],
            'name' => ['required', 'array'],
            'slug' => ['required', 'string', 'unique:categories,slug'],
        ]);

        try {
            $category = Category::create($validated);
            return response()->json(['message' => 'Category created.', 'data' => $category], 201);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to create category.'], 500);
        }
    }

    public function show(Category $category): JsonResponse
    {
        return response()->json(['data' => $category], 200);
    }

    public function update(Request $request, Category $category): JsonResponse
    {
        $validated = $request->validate([
            'type' => ['sometimes', 'in:directorate,city_admin,general'],
            'name' => ['sometimes', 'array'],
            'slug' => ['sometimes', 'string', 'unique:categories,slug,' . $category->id],
        ]);

        try {
            $category->update($validated);
            return response()->json(['message' => 'Category updated.', 'data' => $category], 200);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to update category.'], 500);
        }
    }

    public function destroy(Category $category): JsonResponse
    {
        try {
            $category->delete();
            return response()->json(['message' => 'Category deleted.'], 200);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to delete category.'], 500);
        }
    }
}