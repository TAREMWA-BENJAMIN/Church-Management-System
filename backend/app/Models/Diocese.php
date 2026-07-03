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

    public function parishes()
    {
        return $this->hasManyThrough(Parish::class, Archdeaconry::class);
    }

    public function finances()
    {
        // Custom query to get all finances for this diocese's parishes
        $parishIds = $this->parishes()->pluck('parishes.id');
        return FinanceRecord::whereIn('parish_id', $parishIds);
    }
}
