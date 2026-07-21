<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasOrganizationUnitSecurity;

class Member extends Model
{
    use HasFactory, HasOrganizationUnitSecurity;

    protected $fillable = [
        'organization_unit_id',
        'first_name',
        'last_name',
        'date_of_birth',
        'gender',
        'phone_number',
        'status',
    ];

    public function organizationUnit()
    {
        return $this->belongsTo(OrganizationUnit::class);
    }
}
