<?php

namespace App\Http\Controllers;

use App\Models\Institution;
use App\Models\OrganizationUnit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InstitutionController extends Controller
{
    public function index()
    {
        $institutions = Institution::with(['organizationUnit', 'geographicalUnit'])->latest()->get();
        $managingUnits = OrganizationUnit::with('type')->get();
        $locationUnits = OrganizationUnit::withoutGlobalScope('organizationUnitSecurity')->with('type')->get();

        $user = auth()->user();

        return Inertia::render('Institutions/Index', [
            'institutions' => $institutions,
            'managingUnits' => $managingUnits,
            'locationUnits' => $locationUnits,
            'canEditIds' => $user->is_super_admin ? 'all' : $user->getAllowedOrganizationUnitIds(),
            'canManage' => $user->canManageInstitutionsAndDirectorates()
        ]);
    }

    public function store(Request $request)
    {
        abort_if(!auth()->user()->canManageInstitutionsAndDirectorates(), 403, 'Unauthorized action.');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'organization_unit_id' => 'required|exists:organization_units,id',
            'geographical_unit_id' => 'required|exists:organization_units,id',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'status' => 'required|string|in:Active,Inactive'
        ]);

        Institution::create($validated);

        return redirect()->back()->with('message', 'Institution created successfully');
    }

    public function update(Request $request, Institution $institution)
    {
        abort_if(!auth()->user()->canManageInstitutionsAndDirectorates(), 403, 'Unauthorized action.');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'organization_unit_id' => 'required|exists:organization_units,id',
            'geographical_unit_id' => 'required|exists:organization_units,id',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'status' => 'required|string|in:Active,Inactive'
        ]);

        $institution->update($validated);

        return redirect()->back()->with('message', 'Institution updated successfully');
    }

    public function destroy(Institution $institution)
    {
        abort_if(!auth()->user()->canManageInstitutionsAndDirectorates(), 403, 'Unauthorized action.');

        $institution->delete();
        return redirect()->back()->with('message', 'Institution deleted successfully');
    }
}
