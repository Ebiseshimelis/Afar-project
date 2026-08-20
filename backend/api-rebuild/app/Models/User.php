<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable([
    'name',
    'email',
    'password',
    'role',
    'permissions',
    'is_active',
    'account_status',
])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'permissions',
        'is_active',
        'account_status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'permissions' => 'array',
        ];
    }

    /**
     * Determine whether this account is a Super Admin.
     */
    public function isSuperAdmin(): bool
    {
        return $this->role === 'super_admin';
    }

    /**
     * Determine whether this account is a normal Admin.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Determine whether the account has been approved.
     */
    public function isApproved(): bool
    {
        return $this->account_status === 'approved';
    }

    /**
     * Determine whether the account is waiting for approval.
     */
    public function isPending(): bool
    {
        return $this->account_status === 'pending';
    }

    /**
     * Determine whether the account has been rejected.
     */
    public function isRejected(): bool
    {
        return $this->account_status === 'rejected';
    }

    /**
     * Determine whether the user has a specific permission.
     *
     * Super Admins automatically have every permission.
     */
    public function hasPermission(string $permission): bool
    {
        if ($this->isSuperAdmin()) {
            return true;
        }

        if (
            !$this->isAdmin() ||
            !$this->is_active ||
            !$this->isApproved()
        ) {
            return false;
        }

        return in_array($permission, $this->permissions ?? [], true);
    }

    /**
     * Determine whether the user has at least one permission
     * from the supplied list.
     */
    public function hasAnyPermission(array $permissions): bool
    {
        if ($this->isSuperAdmin()) {
            return true;
        }

        foreach ($permissions as $permission) {
            if ($this->hasPermission($permission)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Determine whether the user has all supplied permissions.
     */
    public function hasAllPermissions(array $permissions): bool
    {
        if ($this->isSuperAdmin()) {
            return true;
        }

        foreach ($permissions as $permission) {
            if (!$this->hasPermission($permission)) {
                return false;
            }
        }

        return true;
    }
}
