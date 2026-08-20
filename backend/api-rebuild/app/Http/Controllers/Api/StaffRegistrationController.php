<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class StaffRegistrationController extends Controller
{
    /**
     * Register a new Admin account.
     *
     * Registration is public.
     * The new account remains pending until approved
     * by a Super Admin.
     */
    public function register(Request $request): JsonResponse
    {
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

            // Public registration can only create normal Admin accounts.
            'role' => 'admin',

            // New registrations must wait for Super Admin approval.
            'account_status' => 'pending',

            // Pending accounts cannot access the admin panel.
            'is_active' => false,

            // Permissions are assigned by the Super Admin after approval.
            'permissions' => [],
        ]);

        return response()->json([
            'message' => 'Registration submitted successfully. Your account is waiting for Super Admin approval.',
            'status' => 'pending',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'account_status' => $user->account_status,
            ],
        ], 201);
    }
}
