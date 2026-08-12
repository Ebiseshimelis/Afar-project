<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vacancy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Throwable;

class VacancyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $vacancies = Vacancy::with('author')
                ->where('deadline', '>=', now())
                ->orderBy('deadline', 'asc')
                ->paginate($request->integer('per_page', 15));

            return response()->json($vacancies, 200);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to retrieve vacancies.'], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        if (!$request->user()?->isAdmin()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $validated = $request->validate([
            'title'     => ['required', 'array'],
            'content'   => ['required', 'array'],
            'position'  => ['required', 'array'],
            'salary'    => ['nullable', 'string'],
            'file'      => ['nullable', 'file', 'mimes:pdf,doc,docx,jpg,jpeg,png,webp', 'max:2048'],
            'deadline'  => ['required', 'date'],
            'status'    => ['required', 'in:draft,published'],
        ]);

        try {
            $payload = [
                ...$validated,
                'created_by' => $request->user()->id,
            ];

            if ($request->hasFile('file')) {
                $payload['file_path'] = $request->file('file')->store('vacancies', 'public');
            }

            $vacancy = Vacancy::create($payload);

            return response()->json(['message' => 'Vacancy posted successfully.', 'data' => $vacancy], 201);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to post vacancy.'], 500);
        }
    }

    public function show(Vacancy $vacancy): JsonResponse
    {
        return response()->json(['data' => $vacancy->load('author')], 200);
    }

    public function update(Request $request, Vacancy $vacancy): JsonResponse
    {
        if (!$request->user()?->isAdmin()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $validated = $request->validate([
            'title'    => ['sometimes', 'array'],
            'content'  => ['sometimes', 'array'],
            'salary'   => ['nullable', 'string'],
            'file'     => ['nullable', 'file', 'mimes:pdf,doc,docx,jpg,jpeg,png,webp', 'max:2048'],
            'deadline' => ['sometimes', 'date'],
            'status'   => ['sometimes', 'in:draft,published'],
        ]);

        try {
            $payload = $validated;

            if ($request->hasFile('file')) {
                if ($vacancy->file_path && Storage::disk('public')->exists($vacancy->file_path)) {
                    Storage::disk('public')->delete($vacancy->file_path);
                }

                $payload['file_path'] = $request->file('file')->store('vacancies', 'public');
            }

            $vacancy->update($payload);
            return response()->json(['message' => 'Vacancy updated.', 'data' => $vacancy], 200);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to update vacancy.'], 500);
        }
    }

    public function destroy(Vacancy $vacancy): JsonResponse
    {
        try {
            $vacancy->delete();
            return response()->json(['message' => 'Vacancy deleted.'], 200);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to delete vacancy.'], 500);
        }
    }
}