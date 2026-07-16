<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FinanceRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'parish_id',
        'directorate_id',
        'type',
        'category',
        'amount',
        'description',
        'date',
        'recorded_by'
    ];

    public function parish()
    {
        return $this->belongsTo(Parish::class);
    }

    public function directorate()
    {
        return $this->belongsTo(Directorate::class);
    }
}
