<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (\App\Models\Diocese::count() === 0) {
            $d = \App\Models\Diocese::create(['name' => 'Diocese of Kampala', 'bishop_name' => 'Bishop James']);
            $a = \App\Models\Archdeaconry::create(['diocese_id' => $d->id, 'name' => 'Central Archdeaconry']);
            \App\Models\Parish::create(['archdeaconry_id' => $a->id, 'name' => 'All Saints Cathedral', 'priest_name' => 'Rev. John']);
            \App\Models\Parish::create(['archdeaconry_id' => $a->id, 'name' => 'St. Pauls Parish', 'priest_name' => 'Rev. Peter']);
        }
    }
}
