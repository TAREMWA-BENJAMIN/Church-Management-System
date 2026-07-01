<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Diocese extends Model
{
    protected $guarded = [];

    public function archdeaconries()
    {
        return $this->hasMany(Archdeaconry::class);
    }
}
