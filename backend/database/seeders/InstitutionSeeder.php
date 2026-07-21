<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\OrganizationUnit;
use App\Models\OrganizationUnitType;

class InstitutionSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Ensure the Province exists (Root)
        $provinceType = OrganizationUnitType::firstOrCreate(['name' => 'Province']);
        $province = OrganizationUnit::firstOrCreate(
            ['name' => 'Province of the Church of Uganda'],
            ['organization_unit_type_id' => $provinceType->id]
        );

        // 2. Create the types for institutions
        $types = [
            'Company',
            'Conference Centre',
            'Guest House',
            'Medical Bureau',
            'Hospital',
            'University',
            'Museum',
            'Bookshop',
            'Publishing',
        ];

        $typeModels = [];
        foreach ($types as $name) {
            $typeModels[$name] = OrganizationUnitType::firstOrCreate([
                'name' => $name
            ]);
        }

        // 3. Create the actual institutions and link them to the Province
        $institutions = [
            ['name' => 'Church Commissioners Holding Company Limited', 'type' => 'Company'],
            ['name' => 'Lweza Training and Conference Centre', 'type' => 'Conference Centre'],
            ['name' => 'Nabugabo Holiday Centre', 'type' => 'Conference Centre'],
            ['name' => 'Namirembe Guest House', 'type' => 'Guest House'],
            ['name' => 'Uganda Protestant Medical Bureau', 'type' => 'Medical Bureau'],
            ['name' => 'Mengo Hospital', 'type' => 'Hospital'],
            ['name' => 'Ndejje University', 'type' => 'University'],
            ['name' => 'Uganda Martyrs Museum', 'type' => 'Museum'],
            ['name' => 'Uganda Bookshop', 'type' => 'Bookshop'],
            ['name' => 'Centenary Publishing', 'type' => 'Publishing'],
            ['name' => 'Uganda Christian University', 'type' => 'University'],
        ];

        foreach ($institutions as $inst) {
            OrganizationUnit::firstOrCreate([
                'name' => $inst['name'],
                'organization_unit_type_id' => $typeModels[$inst['type']]->id,
                'parent_id' => $province->id
            ]);
        }
    }
}
