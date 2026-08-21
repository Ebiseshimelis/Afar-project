<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Check whether the authenticated user has the required permission.
     *
     * The database is the source of truth for:
     * - account activity
     * - account approval status
     * - individual permissions
     *
     * Super Admins automatically pass permission checks because
     * User::hasPermission() grants them unrestricted permissions.
     */
    public function handle(
        Request $request,
        Closure $next,
        string $permission
    ): Response {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        /*
         * The account must currently be active.
         *
         * This is checked from the database-backed User model on
         * every protected request, so disabling an account takes
         * effect immediately.
         */
        if (!$user->is_active) {
            return response()->json([
                'message' => 'Your account has been disabled.',
            ], 403);
        }

        /*
         * The account must currently be approved.
         *
         * This prevents pending or rejected Admin accounts from
         * accessing protected API endpoints, even if they still
         * possess an old valid Sanctum token.
         */
        if (!$user->isApproved()) {
            return response()->json([
                'message' => match ($user->account_status) {
                    'pending' => 'Your account is waiting for Super Admin approval.',
                    'rejected' => 'Your account has been rejected. Please contact the Super Admin.',
                    default => 'Your account is not approved.',
                },
            ], 403);
        }

        /*
         * Keep the existing individual permission system exactly
         * as it is.
         *
         * We are NOT changing:
         * news.view
         * news.create
         * news.update
         * news.delete
         *
         * Each permission continues to be checked independently.
         */
        if (!$user->hasPermission($permission)) {
            return response()->json([
                'message' => 'You do not have permission to perform this action.',
                'permission' => $permission,
            ], 403);
        }

        return $next($request);
    }
}
