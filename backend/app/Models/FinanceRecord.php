<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasOrganizationUnitSecurity;

class FinanceRecord extends Model
{
    use HasFactory, HasOrganizationUnitSecurity;

    protected $fillable = [
        'organization_unit_id',
        'type',
        'recorded_by',
        'category',
        'amount',
        'description',
        'date'
    ];

    protected $casts = [
        'date' => 'date',
        'amount' => 'decimal:2',
    ];

    public function organizationUnit()
    {
        return $this->belongsTo(OrganizationUnit::class);
    }

    public function recorder()
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }
}
