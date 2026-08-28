<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
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
            ->with('assignedRole.rolePermissions')
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
     * A client can never create a Super Admin through this endpoint.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],

            'email' => [
                'required',
                'email',
                'max:255',
                'unique:users,email',
            ],

            'password' => [
                'required',
                'string',
                'min:8',
            ],

            'role_id' => [
                'sometimes',
                'nullable',
                'integer',
                Rule::exists('roles', 'id'),
            ],

            'is_active' => [
                'sometimes',
                'boolean',
            ],

            'account_status' => [
                'sometimes',
                Rule::in([
                    'pending',
                    'approved',
                    'rejected',
                ]),
            ],
        ]);

        $role = null;

        if (
            array_key_exists('role_id', $validated) &&
            $validated['role_id'] !== null
        ) {
            $role = Role::findOrFail($validated['role_id']);
        }

        /*
         * If no role is supplied, the account can remain unassigned.
         * It will not receive role-based permissions until a role
         * is assigned by the Super Admin.
         */
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'admin',
            'role_id' => $role?->id,
            'is_active' => $validated['is_active'] ?? false,
            'account_status' => $validated['account_status'] ?? 'pending',

            /*
             * Role-based permissions are now the source of truth.
             * Keep the legacy column empty.
             */
            'permissions' => [],
        ]);

        $user->load('assignedRole.rolePermissions');

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
    public function update(
        Request $request,
        User $user
    ): JsonResponse {
        $this->ensureNormalAdmin($user);

        $validated = $request->validate([
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
            ],

            'email' => [
                'sometimes',
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],

            'password' => [
                'sometimes',
                'nullable',
                'string',
                'min:8',
            ],

            'role_id' => [
                'sometimes',
                'nullable',
                'integer',
                Rule::exists('roles', 'id'),
            ],

            'is_active' => [
                'sometimes',
                'boolean',
            ],

            'account_status' => [
                'sometimes',
                Rule::in([
                    'pending',
                    'approved',
                    'rejected',
                ]),
            ],
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
            $user->password = Hash::make(
                $validated['password']
            );
        }

        if (array_key_exists('role_id', $validated)) {
            $user->role_id = $validated['role_id'];
        }

        if (array_key_exists('is_active', $validated)) {
            $user->is_active = $validated['is_active'];

            /*
             * Revoke tokens when an account is disabled.
             */
            if (!$validated['is_active']) {
                $user->tokens()->delete();
            }
        }

        if (array_key_exists('account_status', $validated)) {
            $user->account_status =
                $validated['account_status'];

            if (
                $validated['account_status'] === 'approved'
            ) {
                $user->is_active = true;
            }

            if (
                in_array(
                    $validated['account_status'],
                    ['pending', 'rejected'],
                    true
                )
            ) {
                $user->is_active = false;
                $user->tokens()->delete();
            }
        }

        /*
         * Never allow this endpoint to turn an Admin
         * into a Super Admin.
         */
        $user->role = 'admin';

        /*
         * Role-based permissions are the source of truth.
         */

        $user->save();

        $user->load('assignedRole.rolePermissions');

        return response()->json([
            'message' => 'Admin account updated successfully.',
            'data' => $this->adminPayload($user),
        ]);
    }

    /**
     * Delete a normal Admin account.
     */
    public function destroy(User $user): JsonResponse
    {
        $this->ensureNormalAdmin($user);

        /*
         * Revoke all active tokens before deleting.
         */
        $user->tokens()->delete();

        $user->delete();

        return response()->json([
            'message' => 'Admin account deleted successfully.',
        ]);
    }

    /**
     * Only normal Admin accounts can be managed here.
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
        $role = $user->assignedRole;

        return [
            'id' => (string) $user->id,
            'name' => $user->name,
            'email' => $user->email,

            'role' => 'admin',

            'role_id' => $role?->id
                ? (string) $role->id
                : null,

            'role_name' => $role?->name,

            'is_active' => (bool) $user->is_active,

            'account_status' => $user->account_status,

            /*
             * Permissions come from the assigned database role.
             */
            'permissions' => $role
                ? $role->permissionKeys()
                : [],

            'permissions_count' => $role
                ? count($role->permissionKeys())
                : 0,
        ];
    }
}



