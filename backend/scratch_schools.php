<?php
use App\Models\OrganizationUnit;
use App\Models\OrganizationUnitType;

$province = OrganizationUnit::where('name', 'Province of the Church of Uganda')->first();
$priType = OrganizationUnitType::firstOrCreate(['name' => 'Primary School']);
$secType = OrganizationUnitType::firstOrCreate(['name' => 'Secondary School']);

OrganizationUnit::firstOrCreate([
    'name' => 'St. Paul Primary School', 
    'organization_unit_type_id' => $priType->id, 
    'parent_id' => $province->id
]);

OrganizationUnit::firstOrCreate([
    'name' => 'Kings College Budo (Secondary)', 
    'organization_unit_type_id' => $secType->id, 
    'parent_id' => $province->id
]);

echo "Schools added successfully.\n";
