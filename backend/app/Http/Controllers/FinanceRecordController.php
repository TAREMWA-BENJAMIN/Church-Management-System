<?php

namespace App\Http\Controllers;

use App\Models\FinanceRecord;
use App\Models\OrganizationUnit;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class FinanceRecordController extends Controller
{
    public function index()
    {
        $records = FinanceRecord::with(['organizationUnit', 'recorder'])
            ->latest('date')
            ->get();
            
        $units = OrganizationUnit::all();

        return Inertia::render('Finance/Index', [
            'records' => $records,
            'units' => $units
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'organization_unit_id' => 'required|exists:organization_units,id',
            'type' => 'required|in:income,expenditure',
            'category' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string',
            'date' => 'required|date',
        ]);

        $validated['recorded_by'] = Auth::id() ?? 1; // Fallback to 1 if not logged in (e.g. testing)

        FinanceRecord::create($validated);

        return redirect()->back()->with('success', 'Transaction recorded successfully.');
    }

    public function update(Request $request, FinanceRecord $finance)
    {
        $validated = $request->validate([
            'organization_unit_id' => 'required|exists:organization_units,id',
            'type' => 'required|in:income,expenditure',
            'category' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string',
            'date' => 'required|date',
        ]);

        $finance->update($validated);

        return redirect()->back()->with('success', 'Transaction updated successfully.');
    }

    public function destroy(FinanceRecord $finance)
    {
        $finance->delete();
        return redirect()->back()->with('success', 'Transaction deleted successfully.');
    }
}
