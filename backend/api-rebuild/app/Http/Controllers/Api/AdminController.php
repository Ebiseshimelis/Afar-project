<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function roles(Request $request): JsonResponse
    {
        $this->ensureSuperAdmin($request);

        return response()->json([
            'data' => [
                [
                    'id' => 'super_admin',
                    'name' => 'Super Admin',
                    'description' => 'Full access to all administrative functions.',
                    'users' => User::where('role', 'super_admin')->count(),
                    'permissions' => ['*'],
                    'editable' => false,
                ],
                [
                    'id' => 'admin',
                    'name' => 'Admin',
                    'description' => 'Normal administrative account with individually assigned permissions.',
                    'users' => User::where('role', 'admin')->count(),
                    'permissions' => [],
                    'editable' => false,
                ],
            ],
        ]);
    }

    public function users(Request $request): JsonResponse
    {
        $this->ensureSuperAdmin($request);

        $users = User::query()
            ->whereIn('role', ['admin', 'super_admin'])
            ->orderBy('name')
            ->get()
            ->map(fn (User $user) => $this->userPayload($user))
            ->values();

        return response()->json([
            'data' => $users,
        ]);
    }

    public function assignRole(Request $request, User $user): JsonResponse
    {
        $this->ensureSuperAdmin($request);

        $validated = $request->validate([
            'role' => ['required', 'in:admin,super_admin'],
        ]);

        $actor = $request->user();

        if ($user->id === $actor->id && $validated['role'] !== 'super_admin') {
            return response()->json([
                'message' => 'You cannot remove your own Super Admin role.',
            ], 422);
        }

        if (
            $user->role === 'super_admin' &&
            $validated['role'] === 'admin' &&
            User::where('role', 'super_admin')->count() <= 1
        ) {
            return response()->json([
                'message' => 'At least one Super Admin account must remain.',
            ], 422);
        }

        $user->role = $validated['role'];

        if ($validated['role'] === 'super_admin') {
            $user->permissions = null;
        } elseif ($user->permissions === null) {
            $user->permissions = [];
        }

        $user->save();

        return response()->json([
            'message' => 'Role updated successfully.',
            'data' => $this->userPayload($user->fresh()),
        ]);
    }

    public function status(Request $request, User $user): JsonResponse
    {
        $this->ensureSuperAdmin($request);

        $validated = $request->validate([
            'is_active' => ['required', 'boolean'],
        ]);

        if ($user->id === $request->user()->id && !$validated['is_active']) {
            return response()->json([
                'message' => 'You cannot disable your own account.',
            ], 422);
        }

        $user->is_active = $validated['is_active'];
        $user->save();

        if (!$user->is_active) {
            $user->tokens()->delete();
        }

        return response()->json([
            'message' => $user->is_active
                ? 'Account enabled successfully.'
                : 'Account disabled successfully.',
            'data' => $this->userPayload($user->fresh()),
        ]);
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        $this->ensureSuperAdmin($request);

        if ($user->id === $request->user()->id) {
            return response()->json([
                'message' => 'You cannot delete your own account.',
            ], 422);
        }

        if (
            $user->role === 'super_admin' &&
            User::where('role', 'super_admin')->count() <= 1
        ) {
            return response()->json([
                'message' => 'At least one Super Admin account must remain.',
            ], 422);
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json([
            'message' => 'Staff account deleted successfully.',
        ]);
    }

    private function ensureSuperAdmin(Request $request): void
    {
        abort_unless(
            $request->user()?->isSuperAdmin(),
            403,
            'Only Super Admins can manage users, roles, and permissions.'
        );
    }

    private function userPayload(User $user): array
    {
        return [
            'id' => (string) $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'is_active' => (bool) $user->is_active,
            'permissions' => $user->isSuperAdmin()
                ? ['*']
                : ($user->permissions ?? []),
            'last_login' => null,
        ];
    }
}
