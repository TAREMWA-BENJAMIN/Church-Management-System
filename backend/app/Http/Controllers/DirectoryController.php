<?php

namespace App\Http\Controllers;

use App\Models\Diocese;
use App\Models\Parish;
use Illuminate\Http\Request;

class DirectoryController extends Controller
{
    public function dioceses(Request $request)
    {
        $user = $request->user();
        $query = Diocese::select('id', 'name', 'bishop_name');

        if ($user->canAccessFullDirectory()) {
            // Keep the full provincial directory visible for super admin and provincial leaders.
        } elseif ($user->isDioceseAdmin()) {
            $query->where('id', $user->diocese_id);
        } elseif ($user->isArchdeaconAdmin()) {
            $query->whereHas('archdeaconries', function ($q) use ($user) {
                $q->where('id', $user->archdeaconry_id);
            });
        } elseif ($user->isParishAdmin()) {
            $query->whereHas('archdeaconries.parishes', function ($q) use ($user) {
                $q->where('id', $user->parish_id);
            });
        }

        return response()->json($query->get());
    }

    public function parishes(Request $request)
    {
        $user = $request->user();
        $query = Parish::select('id', 'name', 'archdeaconry_id')->with('archdeaconry.diocese');

        if ($user->canAccessFullDirectory()) {
            // Keep the full provincial directory visible for super admin and provincial leaders.
        } elseif ($user->isDioceseAdmin()) {
            $query->whereHas('archdeaconry', function ($q) use ($user) {
                $q->where('diocese_id', $user->diocese_id);
            });
        } elseif ($user->isArchdeaconAdmin()) {
            $query->where('archdeaconry_id', $user->archdeaconry_id);
        } elseif ($user->isParishAdmin()) {
            $query->where('id', $user->parish_id);
        }

        return response()->json($query->get());
    }

    public function archdeaconries(Request $request)
    {
        $user = $request->user();
        $query = \App\Models\Archdeaconry::select('id', 'name', 'diocese_id')->with('diocese');

        if ($user->canAccessFullDirectory()) {
            // Keep the full provincial directory visible for super admin and provincial leaders.
        } elseif ($user->isDioceseAdmin()) {
            $query->where('diocese_id', $user->diocese_id);
        } elseif ($user->isArchdeaconAdmin()) {
            $query->where('id', $user->archdeaconry_id);
        } elseif ($user->isParishAdmin()) {
            $query->whereHas('parishes', function ($q) use ($user) {
                $q->where('id', $user->parish_id);
            });
        }

        return response()->json($query->get());
    }

    public function directorates(Request $request)
    {
        $user = $request->user();
        $query = \App\Models\Directorate::select('id', 'name', 'diocese_id')->with('diocese');

        // Note: For now, if $user->isDioceseAdmin(), they can see their diocese's directorates + provincial ones (diocese_id null).
        // If they are SuperAdmin or Archbishop, they see all.
        if ($user->isDioceseAdmin()) {
            $query->where(function ($q) use ($user) {
                $q->where('diocese_id', $user->diocese_id)
                  ->orWhereNull('diocese_id');
            });
        }

        return response()->json($query->get());
    }
}
