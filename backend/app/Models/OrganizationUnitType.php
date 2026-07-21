<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrganizationUnitType extends Model
{
    protected $fillable = ['name', 'description'];

    public function organizationUnits()
    {
        return $this->hasMany(OrganizationUnit::class);
    }
}
