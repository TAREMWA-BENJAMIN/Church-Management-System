<?php

namespace Database\Seeders;

use App\Models\Directorate;
use Illuminate\Database\Seeder;

class DirectorateSeeder extends Seeder
{
    public function run(): void
    {
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
                ['diocese_id' => null] // Provincial level
            );
        }
    }
}
