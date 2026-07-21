<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_super_admin'
    ];

    /**
     * Get all allowed organization unit IDs (including descendants) for this user.
     */
    public function getAllowedOrganizationUnitIds(): array
    {
        if ($this->is_super_admin) {
            return []; // Signal that they are super admin and have no restrictions
        }

        $assignedUnitIds = $this->roleAssignments()->pluck('organization_unit_id')->toArray();
        if (empty($assignedUnitIds)) {
            return [];
        }

        return $this->getDescendantIds($assignedUnitIds);
    }

    private function getDescendantIds(array $parentIds): array
    {
        $allAllowedIds = $parentIds;
        $currentParentIds = $parentIds;

        while (!empty($currentParentIds)) {
            $childrenIds = \App\Models\OrganizationUnit::whereIn('parent_id', $currentParentIds)->pluck('id')->toArray();
            if (empty($childrenIds)) {
                break;
            }
            $allAllowedIds = array_merge($allAllowedIds, $childrenIds);
            $currentParentIds = $childrenIds;
        }

        return array_unique($allAllowedIds);
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function roleAssignments()
    {
        return $this->hasMany(RoleAssignment::class);
    }
}
