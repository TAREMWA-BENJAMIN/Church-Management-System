<?php
use App\Models\OrganizationUnit;
use App\Models\OrganizationUnitType;

$province = OrganizationUnit::where('name', 'Province of the Church of Uganda')->first();
$dirType = OrganizationUnitType::firstOrCreate(['name' => 'Directorate']);

$directorates = [
    'Directorate of Mission and Outreach',
    'Audit and Assurance Services',
    'Finance, Planning, and Investment',
    'Health',
    'HOUSEHOLD AND COMMUNITY TRANSFORMATION',
    'EDUCATION'
];

foreach ($directorates as $dir) {
    OrganizationUnit::firstOrCreate([
        'name' => $dir, 
        'organization_unit_type_id' => $dirType->id, 
        'parent_id' => $province->id
    ]);
}

echo "Directorates added successfully.\n";
