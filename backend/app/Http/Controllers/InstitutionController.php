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
        $institutions = Institution::with('organizationUnit')->latest()->get();
        $units = OrganizationUnit::all();

        return Inertia::render('Institutions/Index', [
            'institutions' => $institutions,
            'units' => $units
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'organization_unit_id' => 'required|exists:organization_units,id',
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
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'organization_unit_id' => 'required|exists:organization_units,id',
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
        $institution->delete();
        return redirect()->back()->with('message', 'Institution deleted successfully');
    }
}
