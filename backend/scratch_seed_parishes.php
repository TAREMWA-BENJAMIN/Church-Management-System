<?php

use App\Models\OrganizationUnit;
use App\Models\OrganizationUnitType;

// Ensure Parish type exists
$parishType = OrganizationUnitType::firstOrCreate(
    ['name' => 'Parish'],
    ['level' => 4] // Province(1) -> Diocese(2) -> Archdeaconry(3) -> Parish(4)
);

// Data structure
$data = [
    "St. John's Makerere Archdeaconry" => [
        "St. John's Church Makerere" => "Makerere, Kampala",
        "St. Francis Chapel MUK" => "Makerere University, Kampala",
        "St. Peter's Church Wandegeya" => "Wandegeya, Kampala",
        "St. Nicholas Church Kalerwe" => "Kalerwe, Kampala",
        "Holy Trinity Church Kivulu" => "Kagugube (Kivulu), Kampala",
        "St. Paul's Church Mulago" => "Mulago, Kampala",
        "St. Luke's Chapel Mulago" => "Mulago, Kampala",
        "Allied Health Anglican Chapel" => "Mulago, Kampala",
        "Kabanyolo Chapel" => "Kabanyolo, Wakiso",
    ],
    "St. Luke's Ntinda Archdeaconry" => [
        "St. Luke's Church Ntinda" => "Ntinda, Kampala",
        "St. Peter's Church Naguru" => "Naguru, Kampala",
        "St. Paul's Okuvu" => "Okuvu, Kampala",
        "St. Andrew's Church Bukoto" => "Bukoto, Kampala",
        "Kampala Community Chapel (WEC)" => "Kampala",
        "Ebenezer Chapel Kigoowa" => "Kigoowa, Kampala",
        "Jubilee Community Chapel Kulambiro" => "Kulambiro, Kampala",
        "Kakumba Chapel Kyambogo" => "Kyambogo, Kampala",
        "St. James Chapel MUBS" => "Makerere University Business School (MUBS), Nakawa, Kampala",
        "Thornycroft Chapel Kyaggwe (UCU)" => "Uganda Christian University, Mukono",
    ],
    "St. Stephen's Kisugu Archdeaconry" => [
        "St. Stephen's Church Kisugu" => "Kisugu, Kampala",
        "Church of the Resurrection Bugolobi" => "Bugolobi, Kampala",
        "Christ Community Church Mutungo" => "Mutungo, Kampala",
        "Kasokoso Church of Uganda" => "Kasokoso, Kampala",
        "St. Stephen Nsambya" => "Nsambya, Kampala",
        "St. Emmanuel Fire Brigade" => "Kampala",
        "Gogonya Church of Uganda" => "Gogonya, Kampala",
        "St. Janani Luwum Church" => "Kyambogo, Kampala",
        "St. Paul's Kiwuliriza" => "MUBS area, Kampala",
        "St. Philip's Wabigalo Church of Uganda" => "Wabigalo, Kampala",
        "Namuwongo Church of Uganda" => "Namuwongo, Kampala",
        "St. Luke's Chapel Butabika" => "Butabika, Kampala",
        "St. John's Luzira Prisons" => "Luzira, Kampala",
    ],
];

$count = 0;

foreach ($data as $archName => $parishes) {
    $archdeaconry = OrganizationUnit::where('name', $archName)->first();
    
    if (!$archdeaconry) {
        echo "Archdeaconry not found: $archName\n";
        continue;
    }
    
    foreach ($parishes as $parishName => $location) {
        $parish = OrganizationUnit::firstOrCreate(
            ['name' => $parishName, 'parent_id' => $archdeaconry->id],
            [
                'organization_unit_type_id' => $parishType->id,
                'address' => $location,
                'email' => null,
                'phone' => null,
            ]
        );
        
        if ($parish->wasRecentlyCreated) {
            $count++;
        }
    }
}

echo "Successfully seeded $count new Parishes.\n";
