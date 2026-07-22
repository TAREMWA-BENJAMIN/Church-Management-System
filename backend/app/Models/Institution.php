<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasOrganizationUnitSecurity;

class Institution extends Model
{
    use HasFactory, HasOrganizationUnitSecurity;

    protected $fillable = [
        'name',
        'type',
        'organization_unit_id',
        'contact_email',
        'contact_phone',
        'address',
        'status',
    ];

    public function organizationUnit()
    {
        return $this->belongsTo(OrganizationUnit::class);
    }
}
