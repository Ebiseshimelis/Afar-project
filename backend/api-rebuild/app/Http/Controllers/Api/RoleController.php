<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class RoleController extends Controller
{
    /**
     * Create a new database role.
     *
     * Only Super Admins may create roles.
     */
    public function store(Request $request): JsonResponse
    {
        $this->ensureSuperAdmin($request);

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                'unique:roles,name',
            ],
            'description' => [
                'nullable',
                'string',
            ],
            'permissions' => [
                'sometimes',
                'array',
            ],
            'permissions.*' => [
                'required',
                'string',
                'max:255',
            ],
        ]);

        $permissions = array_values(array_unique(
            $validated['permissions'] ?? []
        ));

        $role = DB::transaction(function () use (
            $validated,
            $permissions
        ) {
            $role = Role::create([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
            ]);

            foreach ($permissions as $permission) {
                $role->rolePermissions()->create([
                    'permission' => $permission,
                ]);
            }

            return $role;
        });

        $role->load('rolePermissions');

        return response()->json([
            'message' => 'Role created successfully.',
            'data' => [
                'id' => (string) $role->id,
                'name' => $role->name,
                'description' => $role->description,
                'permissions' => $role->permissionKeys(),
                'permissions_count' => count(
                    $role->permissionKeys()
                ),
                'users' => 0,
                'editable' => true,
                'deletable' => true,
            ],
        ], 201);
    }

    /**
     * Update a database role and replace its permissions.
     *
     * Only Super Admins may update roles.
     */
    public function update(
        Request $request,
        Role $role
    ): JsonResponse {
        $this->ensureSuperAdmin($request);

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('roles', 'name')
                    ->ignore($role->id),
            ],
            'description' => [
                'nullable',
                'string',
            ],
            'permissions' => [
                'sometimes',
                'array',
            ],
            'permissions.*' => [
                'required',
                'string',
                'max:255',
            ],
        ]);

        $permissions = array_values(array_unique(
            $validated['permissions'] ?? []
        ));

        DB::transaction(function () use (
            $role,
            $validated,
            $permissions
        ) {
            $role->update([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
            ]);

            $role->rolePermissions()->delete();

            foreach ($permissions as $permission) {
                $role->rolePermissions()->create([
                    'permission' => $permission,
                ]);
            }
        });

        $role->load('rolePermissions');

        return response()->json([
            'message' => 'Role updated successfully.',
            'data' => [
                'id' => (string) $role->id,
                'name' => $role->name,
                'description' => $role->description,
                'permissions' => $role->permissionKeys(),
                'permissions_count' => count(
                    $role->permissionKeys()
                ),
                'users' => $role->users()
                    ->where('role', 'admin')
                    ->count(),
                'editable' => true,
                'deletable' => true,
            ],
        ]);
    }

    /**
     * Delete a database role.
     *
     * Only roles created in the roles table can be deleted.
     */
    public function destroy(
        Request $request,
        Role $role
    ): JsonResponse {
        $this->ensureSuperAdmin($request);

        if (
            $role->users()
                ->where('role', 'admin')
                ->exists()
        ) {
            return response()->json([
                'message' => 'This role cannot be deleted while it is assigned to Admin accounts.',
            ], 422);
        }

        $role->delete();

        return response()->json([
            'message' => 'Role deleted successfully.',
        ]);
    }

    /**
     * Only Super Admins may manage roles.
     */
    private function ensureSuperAdmin(Request $request): void
    {
        abort_unless(
            $request->user()?->isSuperAdmin(),
            403,
            'Only Super Admins can manage roles.'
        );
    }
}
