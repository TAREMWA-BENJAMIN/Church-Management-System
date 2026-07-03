<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Parish extends Model
{
    protected $guarded = [];

    public function archdeaconry()
    {
        return $this->belongsTo(Archdeaconry::class);
    }

    public function cells()
    {
        return $this->hasMany(Cell::class);
    }

    public function finances()
    {
        return $this->hasMany(FinanceRecord::class);
    }
}
