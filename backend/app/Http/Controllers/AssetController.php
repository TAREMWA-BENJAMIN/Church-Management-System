<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\OrganizationUnit;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;

class AssetController extends Controller
{
    public function index()
    {
        $assets = Asset::with('organizationUnit')->latest()->paginate(10);
        $totalAssets = Asset::count();
        $activeAssets = Asset::where('status', 'Active')->count();
        $totalValue = Asset::sum('value');

        // Since Global Scope is active, OrganizationUnit::all() returns only units they can see
        $units = OrganizationUnit::all();

        return Inertia::render('Assets/Index', [
            'assets' => $assets,
            'totalAssets' => $totalAssets,
            'activeAssets' => $activeAssets,
            'totalValue' => $totalValue,
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

        Cache::forget('dashboard_data_' . Auth::id());

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

        Cache::forget('dashboard_data_' . Auth::id());

        return redirect()->back()->with('message', 'Asset updated successfully');
    }

    public function destroy(Asset $asset)
    {
        $asset->delete();
        Cache::forget('dashboard_data_' . Auth::id());
        return redirect()->back()->with('message', 'Asset deleted successfully');
    }
}
