<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

trait HasOrganizationUnitSecurity
{
    protected static function bootHasOrganizationUnitSecurity()
    {
        static::addGlobalScope('organizationUnitSecurity', function (Builder $builder) {
            // Apply security only for logged in users and web routes
            if (!Auth::check()) {
                return;
            }

            $user = Auth::user();

            if ($user->is_super_admin) {
                // Super admins can see everything
                return;
            }

            $allowedIds = $user->getAllowedOrganizationUnitIds();
            
            if (empty($allowedIds)) {
                // If they have no roles, they shouldn't see any protected records
                // Use an impossible condition to return empty result
                $builder->whereRaw('1 = 0');
                return;
            }

            $table = (new static)->getTable();
            
            if ($table === 'organization_units') {
                $builder->whereIn($table . '.id', $allowedIds);
            } elseif ($table === 'institutions') {
                $builder->where(function($q) use ($table, $allowedIds) {
                    $q->whereIn($table . '.organization_unit_id', $allowedIds)
                      ->orWhereIn($table . '.geographical_unit_id', $allowedIds);
                });
            } else {
                $builder->whereIn($table . '.organization_unit_id', $allowedIds);
            }
        });
    }
}
