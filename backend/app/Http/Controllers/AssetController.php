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
        $user = Auth::user();
        $query = Asset::withoutGlobalScope('organizationUnitSecurity')->with('organizationUnit')->latest();

        if (!$user->is_super_admin) {
            $assignedUnitIds = $user->roleAssignments()->pluck('organization_unit_id')->toArray();
            $allDescendantIds = $assignedUnitIds;
            $currentParentIds = $assignedUnitIds;
            
            while (!empty($currentParentIds)) {
                $childIds = \App\Models\OrganizationUnit::withoutGlobalScope('organizationUnitSecurity')
                    ->whereIn('parent_id', $currentParentIds)
                    ->pluck('id')
                    ->toArray();
                    
                if (empty($childIds)) {
                    break;
                }
                
                $allDescendantIds = array_merge($allDescendantIds, $childIds);
                $currentParentIds = $childIds;
            }
            
            if (empty($allDescendantIds)) {
                $query->where('id', '<', 0); // No units
            } else {
                $query->whereIn('organization_unit_id', $allDescendantIds);
            }
        }

        $assets = (clone $query)->paginate(10);
        $totalAssets = (clone $query)->count();
        $activeAssets = (clone $query)->where('status', 'Active')->count();
        $totalValue = (clone $query)->sum('value');

        // Since Global Scope is active, OrganizationUnit::all() returns only units they can see,
        // but for assigning an asset we probably only want them assigning to units they can see.
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
