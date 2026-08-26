<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class StaffSetupController extends Controller
{
    /**
     * Check whether the first Super Admin still needs to be created.
     */
    public function status(): JsonResponse
    {
        $superAdminExists = User::where('role', 'super_admin')->exists();

        return response()->json([
            'setup_required' => !$superAdminExists,
        ]);
    }

    /**
     * Register a new Admin account.
     *
     * Registration is controlled by the system setting:
     *
     *     allow_admin_registration
     *
     * When the setting is enabled:
     * - the submitted information is saved
     * - role is forced to admin
     * - account_status is pending
     * - is_active is false
     * - permissions are empty
     *
     * When the setting is disabled:
     * - registration is rejected
     * - no account is created
     */
    public function registerAdmin(Request $request): JsonResponse
    {
        /*
         * Check the system setting BEFORE validating or creating
         * the account.
         *
         * The database stores boolean settings as:
         *     "1" = enabled
         *     "0" = disabled
         */
        $registrationSetting = SystemSetting::where(
            'key',
            'allow_admin_registration'
        )->first();

        $registrationAllowed =
            $registrationSetting !== null &&
            (
                $registrationSetting->value === '1' ||
                $registrationSetting->value === 1 ||
                $registrationSetting->value === true
            );

        if (!$registrationAllowed) {
            return response()->json([
                'status' => 'error',
                'message' => 'Admin registration is currently disabled. Please contact the Super Admin.',
                'registration_status' => 'disabled',
            ], 403);
        }

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email'),
            ],
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
            ],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),

            /*
             * Always force this to normal Admin.
             *
             * The client cannot choose:
             * - super_admin
             * - user
             * - any other role
             */
            'role' => 'admin',

            /*
             * New Admin accounts must wait for approval.
             */
            'is_active' => false,
            'account_status' => 'pending',

            /*
             * No permissions until a Super Admin assigns them.
             */
            'permissions' => [],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Admin account registration submitted successfully. Your account is waiting for Super Admin approval.',
            'registration_status' => 'pending',

            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'is_active' => (bool) $user->is_active,
                'account_status' => $user->account_status,
                'permissions' => $user->permissions ?? [],
            ],
        ], 201);
    }
}



