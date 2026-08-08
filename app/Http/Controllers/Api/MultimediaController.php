<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMultimediaRequest;
use App\Http\Requests\UpdateMultimediaRequest;
use App\Models\Multimedia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MultimediaController extends Controller
{
    public function index()
    {
        return response()->json(
            Multimedia::latest()->get()
        );
    }

    public function store(StoreMultimediaRequest $request)
    {
        if (!$request->user()?->isAdmin()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $validated = $request->validated();
        $payload = $validated;

        if ($request->hasFile('file')) {
            $payload['file_path'] = $request->file('file')->store('multimedia', 'public');
        }

        $multimedia = Multimedia::create($payload);

        return response()->json($multimedia,201);
    }

    public function show(Multimedia $multimedia)
    {
        return response()->json($multimedia);
    }

    public function update(UpdateMultimediaRequest $request, Multimedia $multimedia)
    {
        if (!$request->user()?->isAdmin()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $payload = $request->validated();

        if ($request->hasFile('file')) {
            if ($multimedia->file_path && Storage::disk('public')->exists($multimedia->file_path)) {
                Storage::disk('public')->delete($multimedia->file_path);
            }

            $payload['file_path'] = $request->file('file')->store('multimedia', 'public');
        }

        $multimedia->update($payload);

        return response()->json($multimedia);
    }

    public function destroy(Multimedia $multimedia)
    {
        $multimedia->delete();

        return response()->json([
            'message'=>'Deleted Successfully'
        ]);
    }
}