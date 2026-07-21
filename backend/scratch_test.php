<?php

$types = App\Models\OrganizationUnitType::all();
$dirCount = App\Models\OrganizationUnit::whereHas('type', function ($q) { $q->where('name', 'Directorate'); })->count();
$financeCount = App\Models\FinanceRecord::count();

echo json_encode([
    'types' => $types->pluck('name')->toArray(),
    'directorates_count' => $dirCount,
    'finance_count' => $financeCount
]);
