<?php

use App\Models\OrganizationUnit;
use App\Models\OrganizationUnitType;

// Create or find the Organization Unit Type for "Diocese"
$dioceseType = OrganizationUnitType::firstOrCreate(
    ['name' => 'Diocese'],
    ['level' => 2] // Assuming level 1 is Province
);

// Create or find the root unit (Province)
$provinceType = OrganizationUnitType::firstOrCreate(
    ['name' => 'Province'],
    ['level' => 1]
);

$rootUnit = OrganizationUnit::firstOrCreate(
    ['name' => 'Church of Uganda - Provincial Office'],
    ['organization_unit_type_id' => $provinceType->id, 'parent_id' => null]
);

$parentId = $rootUnit->id;

$dioceses = [
    'Ankole Diocese', 'Bukedi Diocese', 'Busoga Diocese', 'Central Buganda Diocese',
    'Central Busoga Diocese', 'East Ruwenzori Diocese', 'Kampala Diocese', 'Kigezi Diocese',
    'Kinkiizi Diocese', 'Kitgum Diocese', 'Kumi Diocese', 'Lango Diocese', 'Luweero Diocese',
    'Madi–West Nile Diocese', 'Masindi-Kitara Diocese', 'Mbale Diocese', 'Mityana Diocese',
    'Muhabura Diocese', 'Mukono Diocese', 'Namirembe Diocese', 'Nebbi Diocese', 'North Ankole Diocese',
    'North Karamoja Diocese', 'North Kigezi Diocese', 'North Mbale Diocese', 'Northern Uganda Diocese',
    'North West Ankole Diocese', 'Ruwenzori Diocese', 'Sebei Diocese', 'Soroti Diocese',
    'South Ankole Diocese', 'South Ruwenzori Diocese', 'West Ankole Diocese', 'West Buganda Diocese',
    'West Lango Diocese', 'West Nile Diocese', 'West Buganda East Diocese', 'Karamoja Diocese',
    'West Busoga Diocese'
];

$count = 0;
foreach ($dioceses as $dioceseName) {
    $unit = OrganizationUnit::firstOrCreate(
        ['name' => $dioceseName],
        [
            'organization_unit_type_id' => $dioceseType->id,
            'parent_id' => $parentId,
            'email' => null,
            'phone' => null,
            'address' => null,
        ]
    );
    if ($unit->wasRecentlyCreated) {
        $count++;
    }
}

echo "Successfully seeded $count new Dioceses (Total in list: " . count($dioceses) . ").\n";
