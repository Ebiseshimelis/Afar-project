<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Staff / Admin / Super Admin login.
     */
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'login_type' => ['required', 'in:admin,super_admin'],
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The email or password is incorrect.'],
            ]);
        }

        if (!in_array($user->role, ['admin', 'super_admin'], true)) {
            return response()->json([
                'message' => 'This account is not authorized for staff login.',
            ], 403);
        }

        if (!$user->is_active) {
            return response()->json([
                'message' => 'Your account has been disabled. Please contact the Super Admin.',
            ], 423);
        }

        if ($credentials['login_type'] === 'super_admin' && $user->role !== 'super_admin') {
            return response()->json([
                'message' => 'This account is not authorized for Super Admin login.',
            ], 403);
        }

        if ($credentials['login_type'] === 'admin' && $user->role !== 'admin') {
            return response()->json([
                'message' => 'This account is not authorized for Admin login.',
            ], 403);
        }

        $user->tokens()->delete();

        $token = $user->createToken('admin-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => $this->userPayload($user),
        ]);
    }

    /**
     * Get the currently authenticated staff member.
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $this->userPayload($request->user()),
        ]);
    }

    /**
     * Logout the current staff member.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    /**
     * Build the authenticated user response.
     */
    private function userPayload(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'is_active' => (bool) $user->is_active,

            // Super Admin gets unrestricted access.
            // Admin gets the permissions actually stored in the database.
            'permissions' => $user->isSuperAdmin()
                ? ['*']
                : ($user->permissions ?? []),
        ];
    }
}

