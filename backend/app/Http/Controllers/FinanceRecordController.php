<?php

namespace App\Http\Controllers;

use App\Models\FinanceRecord;
use App\Models\OrganizationUnit;
use App\Models\Institution;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class FinanceRecordController extends Controller
{
    public function index()
    {
        $records = FinanceRecord::with(['organizationUnit', 'recorder', 'institution'])
            ->latest('date')
            ->paginate(10);
            
        $totalIncome = FinanceRecord::where('type', 'income')->sum('amount');
        $totalExpenditure = FinanceRecord::where('type', 'expenditure')->sum('amount');
            
        $units = OrganizationUnit::with('type')->get();
        $institutions = Institution::all();

        return Inertia::render('Finance/Index', [
            'records' => $records,
            'totalIncome' => $totalIncome,
            'totalExpenditure' => $totalExpenditure,
            'units' => $units,
            'institutions' => $institutions
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'organization_unit_id' => 'required|exists:organization_units,id',
            'institution_id' => 'nullable|exists:institutions,id',
            'type' => 'required|in:income,expenditure',
            'category' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string',
            'date' => 'required|date',
        ]);

        $validated['recorded_by'] = Auth::id() ?? 1; // Fallback to 1 if not logged in (e.g. testing)

        FinanceRecord::create($validated);

        Cache::forget('dashboard_data_' . Auth::id());

        return redirect()->back()->with('success', 'Transaction recorded successfully.');
    }

    public function update(Request $request, FinanceRecord $finance)
    {
        $validated = $request->validate([
            'organization_unit_id' => 'required|exists:organization_units,id',
            'institution_id' => 'nullable|exists:institutions,id',
            'type' => 'required|in:income,expenditure',
            'category' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string',
            'date' => 'required|date',
        ]);

        $finance->update($validated);

        Cache::forget('dashboard_data_' . Auth::id());

        return redirect()->back()->with('success', 'Transaction updated successfully.');
    }

    public function destroy(FinanceRecord $finance)
    {
        $finance->delete();
        Cache::forget('dashboard_data_' . Auth::id());
        return redirect()->back()->with('success', 'Transaction deleted successfully.');
    }
}
