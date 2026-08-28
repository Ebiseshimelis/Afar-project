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

        /*
         * Account must be active.
         */
        if (!$user->is_active) {
            return response()->json([
                'message' => 'Your account has been disabled. Please contact the Super Admin.',
            ], 423);
        }

        /*
         * Normal Admins and Super Admins must have an approved account.
         *
         * The database is the source of truth.
         */
        if (!$user->isApproved()) {
            return response()->json([
                'message' => match ($user->account_status) {
                    'pending' => 'Your account is waiting for Super Admin approval.',
                    'rejected' => 'Your account has been rejected. Please contact the Super Admin.',
                    default => 'Your account is not approved for login.',
                },
            ], 403);
        }

        /*
         * Login type must match the stored role exactly.
         */
        if (
            $credentials['login_type'] === 'super_admin' &&
            $user->role !== 'super_admin'
        ) {
            return response()->json([
                'message' => 'This account is not authorized for Super Admin login.',
            ], 403);
        }

        if (
            $credentials['login_type'] === 'admin' &&
            $user->role !== 'admin'
        ) {
            return response()->json([
                'message' => 'This account is not authorized for Admin login.',
            ], 403);
        }

        /*
         * Revoke previous tokens so only the current login remains active.
         */
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
        $user = $request->user();

        /*
         * The current database state is authoritative.
         *
         * If an account was disabled/rejected after login,
         * do not continue treating the session as valid.
         */
        if (!$user->is_active || !$user->isApproved()) {
            $user->currentAccessToken()?->delete();

            return response()->json([
                'message' => 'Your account is no longer active or approved.',
            ], 403);
        }

        return response()->json([
            'user' => $this->userPayload($user),
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
     * Change the password of the currently authenticated staff member.
     */
    public function changePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = $request->user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['The current password is incorrect.'],
            ]);
        }

        $user->password = $validated['password'];
        $user->save();

        return response()->json([
            'message' => 'Password changed successfully.',
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
            'role_name' => $user->assignedRole?->name,
            'is_active' => (bool) $user->is_active,
            'account_status' => $user->account_status,

            /*
             * Super Admin gets unrestricted access.
             * Normal Admin gets the permissions actually stored in DB.
             */
            'permissions' => $user->isSuperAdmin()
                ? ['*']
                : ($user->assignedRole ? $user->assignedRole->permissionKeys() : []),
        ];
    }
}








