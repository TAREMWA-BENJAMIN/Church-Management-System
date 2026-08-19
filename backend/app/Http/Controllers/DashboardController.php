<?php

namespace App\Http\Controllers;

use App\Models\OrganizationUnit;
use App\Models\Member;
use App\Models\FinanceRecord;
use App\Models\User;
use App\Models\OrganizationUnitType;
use App\Models\Asset;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $cacheKey = 'dashboard_data_' . $user->id;
        
        $data = Cache::remember($cacheKey, 300, function() use ($user) {
            $stats = [];

        // 1. Dynamic Organization Unit Counts (Fetch all descendants to show total parishes)
        if ($user->is_super_admin) {
            $unitCounts = OrganizationUnit::withoutGlobalScope('organizationUnitSecurity')
                ->selectRaw('organization_unit_type_id, count(*) as count')
                ->groupBy('organization_unit_type_id')
                ->get();
        } else {
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

            $unitCounts = OrganizationUnit::withoutGlobalScope('organizationUnitSecurity')
                ->whereIn('id', $allDescendantIds)
                ->selectRaw('organization_unit_type_id, count(*) as count')
                ->groupBy('organization_unit_type_id')
                ->get();
        }
            
        $types = OrganizationUnitType::all()->keyBy('id');
        
        foreach ($unitCounts as $uc) {
            $type = $types->get($uc->organization_unit_type_id);
            if ($type) {
                $name = $type->name;
                // Better pluralization
                if (str_ends_with($name, 'y')) {
                    $plural = substr($name, 0, -1) . 'ies';
                } elseif (str_ends_with($name, 'h') || str_ends_with($name, 's')) {
                    $plural = $name . 'es';
                } else {
                    $plural = $name . 's';
                }
                
                $stats[strtolower($plural)] = $uc->count;
            }
        }

        // 2. Members Count (Automatically scoped)
        $stats['members'] = Member::count();

        // Get allowed unit IDs for scoping (used throughout)
        $allowedUnitIds = $user->is_super_admin ? [] : $user->getAllowedOrganizationUnitIds();

        // 3. Staff / Priests Count
        if ($user->is_super_admin) {
            $stats['staff'] = User::count();
        } else {
            $stats['staff'] = User::whereHas('roleAssignments', function($q) use ($allowedUnitIds) {
                $q->whereIn('organization_unit_id', $allowedUnitIds);
            })->count();
        }

        // 4. Total Revenue (Income) (Automatically scoped)
        $stats['revenue'] = number_format(FinanceRecord::where('type', 'income')->sum('amount'));

        // 5. Total Assets Value (Automatically scoped)
        $stats['assets'] = number_format(Asset::sum('value'));

        // 6. Certificate Stats
        $certQuery = \App\Models\Certificate::query();
        if (!$user->is_super_admin) {
            $assignedUnitIds = $user->roleAssignments()->pluck('organization_unit_id')->toArray();
            
            if (!empty($assignedUnitIds)) {
                $certQuery->whereIn('organization_unit_id', $assignedUnitIds);
            } else {
                $certQuery->where('id', '<', 0);
            }
        }
        $stats['totalMarriages'] = (clone $certQuery)->where('type', 'Marriage')->count();
        $stats['totalBaptisms'] = (clone $certQuery)->where('type', 'Baptism')->count();
        $stats['totalConfirmations'] = (clone $certQuery)->where('type', 'Confirmation')->count();
        $stats['totalCertificates'] = (clone $certQuery)->count();

        // 7. Monthly Data for Chart (Current Year)
        $currentYear = date('Y');
        
        $financeRecords = FinanceRecord::whereYear('date', $currentYear)->get(['date', 'amount', 'type']);
        $assetRecords = Asset::whereYear('acquisition_date', $currentYear)->get(['acquisition_date', 'value']);

        $chartData = [];
        for ($i = 1; $i <= 12; $i++) {
            $chartData[] = [
                'name' => date('M', mktime(0, 0, 0, $i, 1)),
                'Income' => 0,
                'Expenses' => 0,
                'Assets' => 0,
            ];
        }

        foreach ($financeRecords as $record) {
            if ($record->date) {
                $monthIndex = (int) date('n', strtotime($record->date)) - 1;
                if ($record->type === 'income') {
                    $chartData[$monthIndex]['Income'] += (float) $record->amount;
                } else if ($record->type === 'expenditure') {
                    $chartData[$monthIndex]['Expenses'] += (float) $record->amount;
                }
            }
        }

        foreach ($assetRecords as $record) {
            if ($record->acquisition_date) {
                $monthIndex = (int) date('n', strtotime($record->acquisition_date)) - 1;
                $chartData[$monthIndex]['Assets'] += (float) $record->value;
            }
        }

            return [
                'stats' => $stats,
                'chartData' => $chartData
            ];
        });

        return Inertia::render('Dashboard', $data);
    }
}
