<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cell extends Model
{
    protected $guarded = [];

    public function parish()
    {
        return $this->belongsTo(Parish::class);
    }

    public function members()
    {
        return $this->hasMany(Member::class);
    }
}
