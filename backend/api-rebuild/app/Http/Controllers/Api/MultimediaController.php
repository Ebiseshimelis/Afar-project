<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMultimediaRequest;
use App\Http\Requests\UpdateMultimediaRequest;
use App\Http\Resources\MultimediaResource;
use App\Models\Multimedia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MultimediaController extends Controller
{
    /**
     * Display multimedia.
     *
     * Public users:
     * - published only
     *
     * Admins:
     * - published + drafts
     */
    public function index(Request $request)
    {
        $query = Multimedia::latest('published_at')
            ->latest('created_at');

        if (!$request->user()?->isAdmin()) {
            $query->where('status', 'published');
        }

        return MultimediaResource::collection(
            $query->get()
        );
    }

    /**
     * Store a new multimedia item.
     */
    public function store(StoreMultimediaRequest $request)
    {
        if (!$request->user()?->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $validated = $request->validated();

        $mediaUrl = $validated['media_url'] ?? null;

        unset(
            $validated['file'],
            $validated['media_url']
        );

        /*
         * IMAGE:
         *
         * If an image file was uploaded, store it locally.
         *
         * Otherwise store the external image URL in
         * file_path.
         */
        if ($request->hasFile('file')) {
            $validated['file_path'] = $request
                ->file('file')
                ->store('multimedia', 'public');
        } elseif (
            ($validated['type'] ?? null) === 'image'
            && $mediaUrl
        ) {
            $validated['file_path'] = $mediaUrl;
        }

        /*
         * VIDEO:
         *
         * Uploaded video is stored locally.
         *
         * Video URL is stored in video_url.
         */
        if (
            ($validated['type'] ?? null) === 'video'
            && $mediaUrl
            && empty($validated['video_url'])
        ) {
            $validated['video_url'] = $mediaUrl;
        }

        /*
         * Record which admin uploaded it.
         */
        $validated['uploaded_by'] = $request->user()->id;

        /*
         * Automatically set publication date.
         */
        if (
            ($validated['status'] ?? null) === 'published'
            && empty($validated['published_at'])
        ) {
            $validated['published_at'] = now();
        }

        $multimedia = Multimedia::create($validated);

        return new MultimediaResource(
            $multimedia->fresh()
        );
    }

    /**
     * Display one multimedia item.
     */
    public function show(
        Request $request,
        Multimedia $multimedia
    ) {
        if (
            !$request->user()?->isAdmin()
            && $multimedia->status !== 'published'
        ) {
            return response()->json([
                'message' => 'Multimedia not found.',
            ], 404);
        }

        return new MultimediaResource($multimedia);
    }

    /**
     * Update multimedia.
     */
    public function update(
        UpdateMultimediaRequest $request,
        Multimedia $multimedia
    ) {
        if (!$request->user()?->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $validated = $request->validated();

        $mediaUrl = $validated['media_url'] ?? null;

        unset(
            $validated['file'],
            $validated['media_url']
        );

        /*
         * If a new local file is uploaded,
         * remove the old LOCAL file.
         *
         * We deliberately do not try to delete external URLs.
         */
        if ($request->hasFile('file')) {
            if (
                $multimedia->file_path
                && !filter_var(
                    $multimedia->file_path,
                    FILTER_VALIDATE_URL
                )
                && Storage::disk('public')->exists(
                    $multimedia->file_path
                )
            ) {
                Storage::disk('public')->delete(
                    $multimedia->file_path
                );
            }

            $validated['file_path'] = $request
                ->file('file')
                ->store('multimedia', 'public');

            /*
             * A new uploaded file replaces an old URL.
             */
            if (($validated['type'] ?? $multimedia->type) === 'image') {
                $validated['video_url'] = null;
            }
        }

        /*
         * IMAGE URL:
         *
         * Store external image URL in file_path.
         */
        if (
            ($validated['type'] ?? $multimedia->type) === 'image'
            && $mediaUrl
        ) {
            if (
                $multimedia->file_path
                && !filter_var(
                    $multimedia->file_path,
                    FILTER_VALIDATE_URL
                )
                && Storage::disk('public')->exists(
                    $multimedia->file_path
                )
            ) {
                Storage::disk('public')->delete(
                    $multimedia->file_path
                );
            }

            $validated['file_path'] = $mediaUrl;
            $validated['video_url'] = null;
        }

        /*
         * VIDEO URL:
         *
         * Store external video URL in video_url.
         */
        if (
            ($validated['type'] ?? $multimedia->type) === 'video'
            && $mediaUrl
        ) {
            $validated['video_url'] = $mediaUrl;

            /*
             * Remove a previous local video file when
             * switching from file -> URL.
             */
            if (
                $multimedia->file_path
                && !filter_var(
                    $multimedia->file_path,
                    FILTER_VALIDATE_URL
                )
                && Storage::disk('public')->exists(
                    $multimedia->file_path
                )
            ) {
                Storage::disk('public')->delete(
                    $multimedia->file_path
                );
            }

            $validated['file_path'] = null;
        }

        /*
         * Automatically set publication date.
         */
        if (
            ($validated['status'] ?? $multimedia->status) === 'published'
            && empty($validated['published_at'])
            && empty($multimedia->published_at)
        ) {
            $validated['published_at'] = now();
        }

        $multimedia->update($validated);

        return new MultimediaResource(
            $multimedia->fresh()
        );
    }

    /**
     * Delete multimedia.
     */
    public function destroy(
        Request $request,
        Multimedia $multimedia
    ) {
        if (!$request->user()?->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        /*
         * Only delete actual local files.
         * Never attempt to delete an external URL.
         */
        if (
            $multimedia->file_path
            && !filter_var(
                $multimedia->file_path,
                FILTER_VALIDATE_URL
            )
            && Storage::disk('public')->exists(
                $multimedia->file_path
            )
        ) {
            Storage::disk('public')->delete(
                $multimedia->file_path
            );
        }

        $multimedia->delete();

        return response()->json([
            'message' => 'Multimedia deleted successfully.',
        ]);
    }
}
