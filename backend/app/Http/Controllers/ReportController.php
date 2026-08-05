<?php

namespace App\Http\Controllers;

use App\Models\FinanceRecord;
use App\Models\Asset;
use App\Models\Institution;
use App\Models\Member;
use App\Models\OrganizationUnit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $units = OrganizationUnit::all();
        $reportType = $request->input('type', 'finance');
        $unitId = $request->input('unit_id');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $data = [];
        $stats = [];

        if ($reportType === 'finance') {
            $query = FinanceRecord::with('organizationUnit');
            if ($unitId) {
                $query->where('organization_unit_id', $unitId);
            }
            if ($startDate) {
                $query->whereDate('date', '>=', $startDate);
            }
            if ($endDate) {
                $query->whereDate('date', '<=', $endDate);
            }
            $stats['income'] = (clone $query)->where('type', 'income')->sum('amount');
            $stats['expenditure'] = (clone $query)->where('type', 'expenditure')->sum('amount');
            $data = $query->latest()->paginate(10)->withQueryString();
        } elseif ($reportType === 'assets') {
            $query = Asset::with('organizationUnit');
            if ($unitId) {
                $query->where('organization_unit_id', $unitId);
            }
            $stats['count'] = (clone $query)->count();
            $stats['totalVal'] = (clone $query)->sum('value');
            $data = $query->latest()->paginate(10)->withQueryString();
        } elseif ($reportType === 'institutions') {
            $query = Institution::with('organizationUnit');
            if ($unitId) {
                $query->where('organization_unit_id', $unitId);
            }
            $stats['count'] = (clone $query)->count();
            $data = $query->latest()->paginate(10)->withQueryString();
        } elseif ($reportType === 'members') {
            $query = Member::with('organizationUnit');
            if ($unitId) {
                $query->where('organization_unit_id', $unitId);
            }
            $stats['count'] = (clone $query)->count();
            $stats['active'] = (clone $query)->where('status', 'active')->count();
            $data = $query->latest()->paginate(10)->withQueryString();
        }

        return Inertia::render('Reports/Index', [
            'units' => $units,
            'reportType' => $reportType,
            'filters' => [
                'unit_id' => $unitId,
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
            'reportData' => $data,
            'stats' => $stats
        ]);
    }
}
