<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrganizationUnit extends Model
{
    protected $fillable = ['name', 'organization_unit_type_id', 'parent_id'];

    public function type()
    {
        return $this->belongsTo(OrganizationUnitType::class, 'organization_unit_type_id');
    }

    public function parent()
    {
        return $this->belongsTo(OrganizationUnit::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(OrganizationUnit::class, 'parent_id');
    }

    public function roleAssignments()
    {
        return $this->hasMany(RoleAssignment::class);
    }
}
