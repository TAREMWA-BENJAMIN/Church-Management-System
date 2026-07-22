<?php

use App\Models\Institution;
use App\Models\OrganizationUnit;

// The "Provincial Office" or root unit is a good default for these institutions.
$rootUnit = OrganizationUnit::first();
$unitId = $rootUnit ? $rootUnit->id : null;

$institutions = [
    ['name' => 'Church Commissioners Holding Company Limited', 'type' => 'Other'],
    ['name' => 'Lweza Training and Conference Centre', 'type' => 'Centre'],
    ['name' => 'Nabugabo Holiday Centre', 'type' => 'Centre'],
    ['name' => 'Namirembe Guest House', 'type' => 'Centre'],
    ['name' => 'Uganda Protestant Medical Bureau', 'type' => 'Hospital'],
    ['name' => 'Rugarama Hospital', 'type' => 'Hospital'],
    ['name' => 'Mengo Hospital', 'type' => 'Hospital'],
    ['name' => 'Kumi Hospital', 'type' => 'Hospital'],
    ['name' => 'Kisiizi Hospital', 'type' => 'Hospital'],
    ['name' => 'Kagando Hospital', 'type' => 'Hospital'],
    ['name' => 'Uganda Bible Institute', 'type' => 'University'],
    ['name' => 'Ndejje University', 'type' => 'University'],
    ['name' => 'Uganda Christian University', 'type' => 'University'],
    ['name' => 'Centenary Publishing', 'type' => 'Publisher'],
    ['name' => 'Uganda Bookshop', 'type' => 'Publisher'],
    ['name' => 'Uganda Martyrs Museum', 'type' => 'Museum'],
    ['name' => 'Secondary and Primary Schools', 'type' => 'School'],
];

foreach ($institutions as $inst) {
    Institution::firstOrCreate(
        ['name' => $inst['name']],
        [
            'type' => $inst['type'],
            'organization_unit_id' => $unitId,
            'contact_email' => null,
            'contact_phone' => null,
            'address' => null,
            'status' => 'Active',
        ]
    );
}

echo "Institutions seeded successfully.\n";
