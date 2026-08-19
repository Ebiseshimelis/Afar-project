<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        abort_unless(
            $request->user()?->isSuperAdmin(),
            403,
            'Only Super Admins can view the permission catalog.'
        );

        $modules = config('permission.assignable_modules', []);
        $actions = config('permission.actions', []);
        $superAdminOnly = config('permission.super_admin_only_modules', []);

        $data = [];

        foreach ($modules as $module) {
            foreach ($actions as $action) {
                $data[] = [
                    'key' => "{$module}.{$action}",
                    'module' => $module,
                    'action' => $action,
                    'super_admin_only' => false,
                ];
            }
        }

        foreach ($superAdminOnly as $module) {
            foreach ($actions as $action) {
                $data[] = [
                    'key' => "{$module}.{$action}",
                    'module' => $module,
                    'action' => $action,
                    'super_admin_only' => true,
                ];
            }
        }

        return response()->json([
            'data' => $data,
        ]);
    }
}
