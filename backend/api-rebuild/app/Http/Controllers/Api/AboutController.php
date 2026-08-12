<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\About;
use Illuminate\Http\JsonResponse;

class AboutController extends Controller
{
    public function index(): JsonResponse
    {
        $about = About::first();

        if (!$about) {
            return response()->json([
                'message' => 'About information not found.'
            ], 404);
        }

        return response()->json($about);
    }
}