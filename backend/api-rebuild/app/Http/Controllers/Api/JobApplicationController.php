<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use App\Models\Vacancy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Throwable;

class JobApplicationController extends Controller
{
    /**
     * Public application submission.
     */
    public function store(Request $request, Vacancy $vacancy): JsonResponse
    {
        if ($vacancy->status !== 'published') {
            return response()->json([
                'message' => 'This vacancy is not available for applications.',
            ], 422);
        }

        if ($vacancy->deadline && $vacancy->deadline->isPast()) {
            return response()->json([
                'message' => 'The application deadline for this vacancy has passed.',
            ], 422);
        }

        $validated = $request->validate([
            'full_name' => [
                'required',
                'string',
                'max:255',
            ],

            'email' => [
                'required',
                'email',
                'max:255',
            ],

            'phone' => [
                'nullable',
                'string',
                'max:50',
            ],

            'address' => [
                'nullable',
                'string',
                'max:500',
            ],

            'education' => [
                'nullable',
                'string',
                'max:5000',
            ],

            'experience' => [
                'nullable',
                'string',
                'max:5000',
            ],

            'resume' => [
                'required',
                'file',
                'mimes:pdf,doc,docx',
                'max:5120',
            ],

            'cover_letter' => [
                'nullable',
                'string',
                'max:10000',
            ],
        ]);

        try {
            /*
             * Prevent the same email from submitting multiple
             * applications to the same vacancy.
             */
            $existing = JobApplication::where('vacancy_id', $vacancy->id)
                ->where('email', $validated['email'])
                ->first();

            if ($existing) {
                return response()->json([
                    'message' => 'An application with this email address has already been submitted for this vacancy.',
                ], 422);
            }

            $resumePath = $request
                ->file('resume')
                ->store('job-applications/resumes', 'public');

            $application = JobApplication::create([
                'vacancy_id' => $vacancy->id,
                'full_name' => $validated['full_name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'address' => $validated['address'] ?? null,
                'education' => $validated['education'] ?? null,
                'experience' => $validated['experience'] ?? null,
                'resume_path' => $resumePath,
                'cover_letter' => $validated['cover_letter'] ?? null,
                'status' => 'submitted',
                'submitted_at' => now(),
            ]);

            return response()->json([
                'message' => 'Application submitted successfully.',
                'data' => [
                    'id' => $application->id,
                    'vacancy_id' => $application->vacancy_id,
                    'status' => $application->status,
                    'submitted_at' => $application->submitted_at,
                ],
            ], 201);

        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to submit application.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Admin: list applications.
     */
    public function index(Request $request): JsonResponse
    {
        if (!$request->user()?->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $query = JobApplication::with([
            'vacancy:id,title,deadline,status',
        ])->latest('submitted_at');

        if ($request->filled('vacancy_id')) {
            $query->where('vacancy_id', $request->integer('vacancy_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('email')) {
            $query->where(
                'email',
                'like',
                '%' . $request->input('email') . '%'
            );
        }

        return response()->json(
            $query->paginate($request->integer('per_page', 20)),
            200
        );
    }

    /**
     * Admin: view one application.
     */
    public function show(
        Request $request,
        JobApplication $jobApplication
    ): JsonResponse {
        if (!$request->user()?->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        return response()->json([
            'data' => $jobApplication->load([
                'vacancy:id,title,deadline,status',
            ]),
        ], 200);
    }

    /**
     * Admin: update application status.
     */
    public function update(
        Request $request,
        JobApplication $jobApplication
    ): JsonResponse {
        if (!$request->user()?->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $validated = $request->validate([
            'status' => [
                'required',
                'in:submitted,reviewing,shortlisted,rejected,hired',
            ],
        ]);

        $jobApplication->update([
            'status' => $validated['status'],
        ]);

        return response()->json([
            'message' => 'Application status updated successfully.',
            'data' => $jobApplication->fresh()->load([
                'vacancy:id,title,deadline,status',
            ]),
        ], 200);
    }

    /**
     * Admin: delete application.
     */
    public function destroy(
        Request $request,
        JobApplication $jobApplication
    ): JsonResponse {
        if (!$request->user()?->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        try {
            if (
                $jobApplication->resume_path &&
                Storage::disk('public')->exists(
                    $jobApplication->resume_path
                )
            ) {
                Storage::disk('public')->delete(
                    $jobApplication->resume_path
                );
            }

            $jobApplication->delete();

            return response()->json([
                'message' => 'Application deleted successfully.',
            ], 200);

        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to delete application.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
