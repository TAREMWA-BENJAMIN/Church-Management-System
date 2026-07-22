<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\OrganizationUnit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssetController extends Controller
{
    public function index()
    {
        $assets = Asset::with('organizationUnit')->latest()->get();
        // Since Global Scope is active, OrganizationUnit::all() returns only units they can see
        $units = OrganizationUnit::all();

        return Inertia::render('Assets/Index', [
            'assets' => $assets,
            'units' => $units
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'organization_unit_id' => 'required|exists:organization_units,id',
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'nullable|string',
            'acquisition_date' => 'nullable|date',
            'value' => 'required|numeric|min:0',
            'status' => 'required|string|in:Active,Maintenance,Disposed'
        ]);

        Asset::create($validated);

        return redirect()->back()->with('message', 'Asset created successfully');
    }

    public function update(Request $request, Asset $asset)
    {
        $validated = $request->validate([
            'organization_unit_id' => 'required|exists:organization_units,id',
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'nullable|string',
            'acquisition_date' => 'nullable|date',
            'value' => 'required|numeric|min:0',
            'status' => 'required|string|in:Active,Maintenance,Disposed'
        ]);

        $asset->update($validated);

        return redirect()->back()->with('message', 'Asset updated successfully');
    }

    public function destroy(Asset $asset)
    {
        $asset->delete();
        return redirect()->back()->with('message', 'Asset deleted successfully');
    }
}
