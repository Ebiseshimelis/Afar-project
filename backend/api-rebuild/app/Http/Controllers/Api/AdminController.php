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

        /*
         * Super Admin roles are permanently protected.
         *
         * A Super Admin can NEVER be downgraded to Admin,
         * even when multiple Super Admin accounts exist.
         */
        if (
            $user->role === 'super_admin' &&
            $validated['role'] !== 'super_admin'
        ) {
            return response()->json([
                'message' => 'A Super Admin role cannot be removed or downgraded.',
            ], 422);
        }

        /*
         * Nobody can remove their own Super Admin role.
         */
        if (
            $user->id === $actor->id &&
            $validated['role'] !== 'super_admin'
        ) {
            return response()->json([
                'message' => 'You cannot remove your own Super Admin role.',
            ], 422);
        }

        $user->role = $validated['role'];

        if ($validated['role'] === 'super_admin') {
            $user->permissions = null;
            $user->account_status = 'approved';
            $user->is_active = true;
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
            'is_active' => ['sometimes', 'boolean'],
            'account_status' => [
                'sometimes',
                'string',
                'in:pending,approved,rejected',
            ],
        ]);

        /*
         * Super Admin accounts are permanently protected.
         *
         * They cannot be:
         * - disabled
         * - rejected
         * - put into pending status
         * - modified through the normal staff status endpoint
         */
        if ($user->role === 'super_admin') {
            if (
                array_key_exists('is_active', $validated) &&
                $validated['is_active'] === false
            ) {
                return response()->json([
                    'message' => 'A Super Admin account cannot be disabled.',
                ], 422);
            }

            if (
                isset($validated['account_status']) &&
                $validated['account_status'] !== 'approved'
            ) {
                return response()->json([
                    'message' => 'A Super Admin account must remain approved and active.',
                ], 422);
            }
        }

        if (
            $user->id === $request->user()->id &&
            array_key_exists('is_active', $validated) &&
            !$validated['is_active']
        ) {
            return response()->json([
                'message' => 'You cannot disable your own account.',
            ], 422);
        }

        if (
            $user->role === 'super_admin' &&
            isset($validated['account_status']) &&
            $validated['account_status'] !== 'approved'
        ) {
            return response()->json([
                'message' => 'A Super Admin account must remain approved.',
            ], 422);
        }

        if (
            isset($validated['account_status']) &&
            $validated['account_status'] === 'approved'
        ) {
            $user->account_status = 'approved';
            $user->is_active = true;
        }

        if (
            isset($validated['account_status']) &&
            $validated['account_status'] === 'rejected'
        ) {
            $user->account_status = 'rejected';
            $user->is_active = false;
            $user->tokens()->delete();
        }

        if (
            isset($validated['account_status']) &&
            $validated['account_status'] === 'pending'
        ) {
            $user->account_status = 'pending';
            $user->is_active = false;
            $user->tokens()->delete();
        }

        if (array_key_exists('is_active', $validated)) {
            $user->is_active = $validated['is_active'];

            if (!$user->is_active) {
                $user->tokens()->delete();
            }

            if (
                $user->role === 'admin' &&
                $user->is_active &&
                $user->account_status !== 'approved'
            ) {
                $user->is_active = false;

                return response()->json([
                    'message' => 'The Admin must be approved before the account can be enabled.',
                    'data' => $this->userPayload($user->fresh()),
                ], 422);
            }
        }

        $user->save();

        return response()->json([
            'message' => match ($user->account_status) {
                'approved' => $user->is_active
                    ? 'Account approved and enabled successfully.'
                    : 'Account approved but currently disabled.',
                'rejected' => 'Account rejected successfully.',
                'pending' => 'Account returned to pending status.',
                default => $user->is_active
                    ? 'Account enabled successfully.'
                    : 'Account disabled successfully.',
            },
            'data' => $this->userPayload($user->fresh()),
        ]);
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        $this->ensureSuperAdmin($request);

        /*
         * Super Admin accounts can NEVER be deleted.
         *
         * This applies even when there is more than one
         * Super Admin account.
         */
        if ($user->role === 'super_admin') {
            return response()->json([
                'message' => 'Super Admin accounts cannot be deleted.',
            ], 422);
        }

        /*
         * A Super Admin cannot delete their own account.
         */
        if ($user->id === $request->user()->id) {
            return response()->json([
                'message' => 'You cannot delete your own account.',
            ], 422);
        }

        /*
         * Normal Admin accounts may be deleted by a Super Admin.
         */
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
            'account_status' => $user->account_status,
            'permissions' => $user->isSuperAdmin()
                ? ['*']
                : ($user->permissions ?? []),
            'last_login' => null,
        ];
    }
}



