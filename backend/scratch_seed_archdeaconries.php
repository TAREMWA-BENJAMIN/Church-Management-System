<?php

use App\Models\OrganizationUnit;
use App\Models\OrganizationUnitType;

// Find Kampala Diocese
$kampalaDiocese = OrganizationUnit::where('name', 'Kampala Diocese')->first();

if (!$kampalaDiocese) {
    echo "Error: Kampala Diocese not found!\n";
    exit;
}

// Find or create 'Archdeaconry' type
$archType = OrganizationUnitType::firstOrCreate(
    ['name' => 'Archdeaconry'],
    ['level' => 3] // Assuming Province = 1, Diocese = 2, Archdeaconry = 3
);

$archdeaconries = [
    "All Saints' Cathedral Kampala Deanery",
    "St. John's Makerere Archdeaconry",
    "St. Stephen's Kisugu Archdeaconry",
    "St. Luke's Ntinda Archdeaconry"
];

$count = 0;
foreach ($archdeaconries as $arch) {
    $unit = OrganizationUnit::firstOrCreate(
        ['name' => $arch, 'parent_id' => $kampalaDiocese->id],
        [
            'organization_unit_type_id' => $archType->id,
            'email' => null,
            'phone' => null,
            'address' => null,
        ]
    );
    if ($unit->wasRecentlyCreated) {
        $count++;
    }
}

echo "Successfully seeded $count new Archdeaconries under Kampala Diocese.\n";
