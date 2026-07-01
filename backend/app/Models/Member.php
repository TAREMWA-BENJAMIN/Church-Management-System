<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    protected $guarded = [];

    public function cell()
    {
        return $this->belongsTo(Cell::class);
    }
}
