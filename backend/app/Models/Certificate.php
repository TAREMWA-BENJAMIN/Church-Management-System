<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'certificate_number',
        'recipient_name',
        'details',
        'issued_date',
        'organization_unit_id',
        'diocese_id',
        'issued_by_user_id',
    ];

    protected $casts = [
        'details' => 'array',
        'issued_date' => 'date',
    ];

    public function organizationUnit()
    {
        return $this->belongsTo(OrganizationUnit::class);
    }

    public function diocese()
    {
        return $this->belongsTo(OrganizationUnit::class, 'diocese_id');
    }

    public function issuedBy()
    {
        return $this->belongsTo(User::class, 'issued_by_user_id');
    }
}
