<?php

namespace App\Http\Controllers;

use App\Models\OrganizationUnit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DirectorateController extends Controller
{
    public function index()
    {
        // Fetch only Organization Units where the type name is 'Directorate'
        $directorates = OrganizationUnit::with(['parent', 'roleAssignments.user'])
            ->whereHas('type', function ($query) {
                $query->where('name', 'Directorate');
            })
            ->get();

        return Inertia::render('Directorates/Index', [
            'directorates' => $directorates
        ]);
    }
}
