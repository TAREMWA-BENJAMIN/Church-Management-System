<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasOrganizationUnitSecurity;

class Asset extends Model
{
    use HasFactory, HasOrganizationUnitSecurity;

    protected $fillable = [
        'organization_unit_id',
        'name',
        'category',
        'description',
        'acquisition_date',
        'value',
        'status',
    ];

    public function organizationUnit()
    {
        return $this->belongsTo(OrganizationUnit::class);
    }
}
