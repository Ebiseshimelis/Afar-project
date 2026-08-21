<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminAccountController extends Controller
{
    /**
     * List all normal Admin accounts.
     *
     * Super Admin only.
     */
    public function index(): JsonResponse
    {
        $admins = User::query()
            ->where('role', 'admin')
            ->orderBy('name')
            ->get()
            ->map(fn (User $user) => $this->adminPayload($user))
            ->values();

        return response()->json([
            'data' => $admins,
        ]);
    }

    /**
     * Create a normal Admin account.
     *
     * A client can never create a super_admin through this endpoint.
     */
    public function store(Request $request): JsonResponse
    {
        $allowedPermissions = $this->assignablePermissionKeys();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'is_active' => ['sometimes', 'boolean'],
            'permissions' => ['sometimes', 'array'],
            'permissions.*' => ['string', Rule::in($allowedPermissions)],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'admin',
            'is_active' => $validated['is_active'] ?? true,
            'permissions' => $this->normalizeAdminPermissions(
                $validated['permissions'] ?? []
            ),
        ]);

        return response()->json([
            'message' => 'Admin account created successfully.',
            'data' => $this->adminPayload($user),
        ], 201);
    }

    /**
     * Update an Admin account.
     *
     * Super Admin only.
     */
    public function update(Request $request, User $user): JsonResponse
    {
        $this->ensureNormalAdmin($user);

        $allowedPermissions = $this->assignablePermissionKeys();

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => [
                'sometimes',
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'password' => ['sometimes', 'nullable', 'string', 'min:8'],
            'is_active' => ['sometimes', 'boolean'],
            'permissions' => ['sometimes', 'array'],
            'permissions.*' => ['string', Rule::in($allowedPermissions)],
        ]);

        if (array_key_exists('name', $validated)) {
            $user->name = $validated['name'];
        }

        if (array_key_exists('email', $validated)) {
            $user->email = $validated['email'];
        }

        if (
            array_key_exists('password', $validated) &&
            $validated['password'] !== null &&
            $validated['password'] !== ''
        ) {
            $user->password = Hash::make($validated['password']);
        }

        if (array_key_exists('is_active', $validated)) {
            $user->is_active = $validated['is_active'];
        }

        if (array_key_exists('permissions', $validated)) {
            $user->permissions = $this->normalizeAdminPermissions(
                $validated['permissions']
            );
        }

        // Never allow this endpoint to turn an Admin into a Super Admin.
        $user->role = 'admin';

        $user->save();

        return response()->json([
            'message' => 'Admin account updated successfully.',
            'data' => $this->adminPayload($user),
        ]);
    }

    /**
     * Replace the permissions assigned to an Admin.
     */
    public function permissions(
        Request $request,
        User $user
    ): JsonResponse {
        $this->ensureNormalAdmin($user);

        $allowedPermissions = $this->assignablePermissionKeys();

        $validated = $request->validate([
            'permissions' => ['required', 'array'],
            'permissions.*' => ['string', Rule::in($allowedPermissions)],
        ]);

        $user->permissions = $this->normalizeAdminPermissions(
            $validated['permissions']
        );

        $user->save();

        return response()->json([
            'message' => 'Admin permissions updated successfully.',
            'data' => $this->adminPayload($user),
        ]);
    }

    /**
     * Delete a normal Admin account.
     */
    public function destroy(User $user): JsonResponse
    {
        $this->ensureNormalAdmin($user);

        // Revoke all active tokens before deleting the account.
        $user->tokens()->delete();

        $user->delete();

        return response()->json([
            'message' => 'Admin account deleted successfully.',
        ]);
    }

    /**
     * Build the complete list of permissions that a normal Admin may receive.
     */
    private function assignablePermissionKeys(): array
    {
        $modules = config('permission.assignable_modules', []);
        $actions = config('permission.actions', []);

        $permissions = [];

        foreach ($modules as $module) {
            foreach ($actions as $action) {
                $permissions[] = "{$module}.{$action}";
            }
        }

        return $permissions;
    }

    /**
     * Normalize a normal Admin permission list.
     */
    private function normalizeAdminPermissions(array $permissions): array
    {
        return array_values(
            array_unique($permissions)
        );
    }

    /**
     * Ensure this endpoint can never modify/delete a Super Admin.
     */
    private function ensureNormalAdmin(User $user): void
    {
        abort_if(
            $user->role !== 'admin',
            403,
            'Only normal Admin accounts can be managed here.'
        );
    }

    /**
     * Data returned to the Admin Accounts UI.
     */
    private function adminPayload(User $user): array
    {
        return [
            'id' => (string) $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => 'admin',
            'is_active' => (bool) $user->is_active,
            'permissions' => $user->permissions ?? [],
        ];
    }
}
