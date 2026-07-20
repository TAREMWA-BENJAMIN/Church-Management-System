<?php

namespace Database\Seeders;

use App\Models\Directorate;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class DirectorateSeeder extends Seeder
{
    public function run(): void
    {
        if (!Schema::hasTable('directorates')) {
            // Table not created yet — skip seeding to avoid errors during migrations
            return;
        }
        $provincialDirectorates = [
            'Directorate of Finance, Planning, and Investment',
            'Directorate of Mission and Outreach',
            'Directorate of Audit and Assurance Services',
            'Directorate of Health',
            'Directorate of Household and Community Transformation',
            'Directorate of Education'
        ];

        foreach ($provincialDirectorates as $name) {
            Directorate::updateOrCreate(
                ['name' => $name],
                ['diocese_id' => null, 'revenue' => 0, 'is_active' => true] // Provincial level
            );
        }
    }
}
