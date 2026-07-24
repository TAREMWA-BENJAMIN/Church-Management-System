<?php

namespace App\Http\Controllers;

use App\Models\OrganizationUnit;
use App\Models\OrganizationUnitType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrganizationUnitController extends Controller
{
    public function index()
    {
        $units = OrganizationUnit::with('type')->get();
        $types = OrganizationUnitType::all();

        return Inertia::render('Organization/Index', [
            'units' => $units,
            'types' => $types,
            'canManage' => auth()->user()->canManageInstitutionsAndDirectorates()
        ]);
    }

    public function store(Request $request)
    {
        abort_if(!auth()->user()->canManageInstitutionsAndDirectorates(), 403, 'Unauthorized action.');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'organization_unit_type_id' => 'required|exists:organization_unit_types,id',
            'parent_id' => 'nullable|exists:organization_units,id'
        ]);

        OrganizationUnit::create($validated);

        return redirect()->back()->with('success', 'Organization unit created.');
    }

    public function update(Request $request, OrganizationUnit $organization)
    {
        abort_if(!auth()->user()->canManageInstitutionsAndDirectorates(), 403, 'Unauthorized action.');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'organization_unit_type_id' => 'required|exists:organization_unit_types,id',
            'parent_id' => 'nullable|exists:organization_units,id'
        ]);

        $organization->update($validated);

        return redirect()->back()->with('success', 'Organization unit updated.');
    }

    public function destroy(OrganizationUnit $organization)
    {
        abort_if(!auth()->user()->canManageInstitutionsAndDirectorates(), 403, 'Unauthorized action.');

        // Children will be deleted automatically due to cascadeOnDelete in migration
        $organization->delete();

        return redirect()->back()->with('success', 'Organization unit deleted.');
    }
}
