<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function assignRole(Request $request): JsonResponse
    {
        if (!$request->user()?->isSuperAdmin()) {
            return response()->json(['message' => 'Only super admins can assign roles.'], 403);
        }

        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'role' => ['required', 'in:staff,super_admin,user'],
        ]);

        $user = User::findOrFail($validated['user_id']);
        $user->role = $validated['role'];
        $user->save();

        return response()->json([
            'message' => 'Role updated successfully.',
            'user' => $user,
        ], 200);
    }
}
