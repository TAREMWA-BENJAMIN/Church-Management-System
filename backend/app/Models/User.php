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
     * Get allowed organization unit IDs for this user.
     *
     * Visibility is ONE level deep:
     *   - Diocese admin sees: Diocese + direct Archdeaconries (NOT individual Parishes)
     *   - Archdeacon sees:    Archdeaconry + direct Parishes (NOT sub-cells)
     *   - Parish Priest sees: Parish only
     *
     * This ensures financial records only "bubble up" one level.
     * To report to the Diocese, an Archdeacon must manually record a
     * consolidated submission at the Diocese level.
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

        // Only go ONE level deep: self + direct children only
        $directChildIds = \App\Models\OrganizationUnit::withoutGlobalScope('organizationUnitSecurity')
            ->whereIn('parent_id', $assignedUnitIds)
            ->pluck('id')
            ->toArray();

        return array_unique(array_merge($assignedUnitIds, $directChildIds));
    }

    /**
     * Check if user is Admin or Directorate level
     */
    public function canManageInstitutionsAndDirectorates(): bool
    {
        if ($this->is_super_admin) {
            return true;
        }

        return $this->roleAssignments()
            ->whereHas('organizationUnit.type', function ($q) {
                $q->whereIn('name', ['Province', 'Directorate']);
            })->exists();
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
