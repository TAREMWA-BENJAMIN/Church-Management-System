<?php

namespace App\Http\Controllers;

use App\Models\OrganizationUnit;
use App\Models\Member;
use App\Models\FinanceRecord;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // 1. Dioceses / Sub-Units Count
        // If super admin, count all Dioceses. If not, count sub-units of the user's units.
        $dioceseType = \App\Models\OrganizationUnitType::where('name', 'Diocese')->first();
        if ($user->is_super_admin) {
            $diocesesCount = OrganizationUnit::where('organization_unit_type_id', $dioceseType?->id)->count();
        } else {
            // Standard users only see units they have access to.
            $diocesesCount = OrganizationUnit::count();
        }

        // 2. Members Count
        $membersCount = Member::count();

        // 3. Staff / Priests Count
        // Filter users who have role assignments in the user's allowed units, or all if super admin
        if ($user->is_super_admin) {
            $staffCount = User::count();
        } else {
            $allowedUnitIds = $user->getAllowedOrganizationUnitIds();
            $staffCount = User::whereHas('roleAssignments', function($q) use ($allowedUnitIds) {
                $q->whereIn('organization_unit_id', $allowedUnitIds);
            })->count();
        }

        // 4. Total Revenue (Income)
        $totalRevenue = FinanceRecord::where('type', 'income')->sum('amount');

        // Formatted values for the dashboard
        return Inertia::render('Dashboard', [
            'stats' => [
                'dioceses' => $diocesesCount,
                'members' => $membersCount,
                'staff' => $staffCount,
                'revenue' => number_format($totalRevenue),
            ]
        ]);
    }
}
