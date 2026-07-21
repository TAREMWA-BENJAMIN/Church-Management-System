<?php

namespace App\Http\Controllers;

use App\Models\OrganizationUnit;
use App\Models\OrganizationUnitType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DirectorateController extends Controller
{
    public function index()
    {
        // Fetch only Organization Units where the type name is 'Directorate'
        $directorateType = OrganizationUnitType::where('name', 'Directorate')->first();
        
        $directorates = OrganizationUnit::with(['parent', 'roleAssignments.user'])
            ->where('organization_unit_type_id', $directorateType?->id)
            ->get();

        $units = OrganizationUnit::all(); // For selecting who the directorate reports to

        return Inertia::render('Directorates/Index', [
            'directorates' => $directorates,
            'directorateType' => $directorateType,
            'units' => $units
        ]);
    }
}
