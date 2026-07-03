<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Archdeaconry extends Model
{
    protected $guarded = [];

    public function diocese()
    {
        return $this->belongsTo(Diocese::class);
    }

    public function parishes()
    {
        return $this->hasMany(Parish::class);
    }

    public function finances()
    {
        return $this->hasManyThrough(FinanceRecord::class, Parish::class);
    }
}
