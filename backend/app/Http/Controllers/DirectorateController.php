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
        
        $directorates = OrganizationUnit::withoutGlobalScope('organizationUnitSecurity')
            ->with(['parent', 'roleAssignments.user'])
            ->where('organization_unit_type_id', $directorateType?->id)
            ->paginate(10);

        // Calculate stats on the whole dataset
        $totalDirectorates = OrganizationUnit::withoutGlobalScope('organizationUnitSecurity')
            ->where('organization_unit_type_id', $directorateType?->id)
            ->count();
            
        $totalStaff = OrganizationUnit::withoutGlobalScope('organizationUnitSecurity')
            ->where('organization_unit_type_id', $directorateType?->id)
            ->withCount('roleAssignments')
            ->get()
            ->sum('role_assignments_count');

        $units = OrganizationUnit::withoutGlobalScope('organizationUnitSecurity')->get(); // For selecting who the directorate reports to

        return Inertia::render('Directorates/Index', [
            'directorates' => $directorates,
            'totalDirectorates' => $totalDirectorates,
            'totalStaff' => $totalStaff,
            'directorateType' => $directorateType,
            'units' => $units,
            'canManage' => auth()->user()->canManageInstitutionsAndDirectorates()
        ]);
    }
}
