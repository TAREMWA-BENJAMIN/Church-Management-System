<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Directorate extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'diocese_id',
        'is_active',
        'revenue',
    ];

    public function diocese()
    {
        return $this->belongsTo(Diocese::class);
    }

    public function financeRecords()
    {
        return $this->hasMany(FinanceRecord::class);
    }
}
