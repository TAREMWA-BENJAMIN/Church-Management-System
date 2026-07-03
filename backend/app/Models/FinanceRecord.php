<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FinanceRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'parish_id',
        'type',
        'category',
        'amount',
        'description',
        'date',
    ];

    public function parish()
    {
        return $this->belongsTo(Parish::class);
    }
}
