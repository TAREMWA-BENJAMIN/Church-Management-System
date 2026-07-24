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

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $stats = [];

        // 1. Dynamic Organization Unit Counts (Automatically scoped by security trait)
        $unitCounts = OrganizationUnit::selectRaw('organization_unit_type_id, count(*) as count')
            ->groupBy('organization_unit_type_id')
            ->get();
            
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

        // 3. Staff / Priests Count
        if ($user->is_super_admin) {
            $stats['staff'] = User::count();
        } else {
            $allowedUnitIds = $user->getAllowedOrganizationUnitIds();
            $stats['staff'] = User::whereHas('roleAssignments', function($q) use ($allowedUnitIds) {
                $q->whereIn('organization_unit_id', $allowedUnitIds);
            })->count();
        }

        // 4. Total Revenue (Income) (Automatically scoped)
        $stats['revenue'] = number_format(FinanceRecord::where('type', 'income')->sum('amount'));

        // 5. Total Assets Value (Automatically scoped)
        $stats['assets'] = number_format(Asset::sum('value'));

        return Inertia::render('Dashboard', [
            'stats' => $stats
        ]);
    }
}
