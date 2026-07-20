<?php

namespace App\Http\Controllers;

use App\Models\Archdeaconry;
use App\Models\Diocese;
use App\Models\Directorate;
use App\Models\Parish;
use Illuminate\Support\Facades\Schema;
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
        // If migrations haven't been run yet, return empty array instead of throwing
        if (!Schema::hasTable('directorates')) {
            return response()->json([]);
        }

        $user = $request->user();
        $query = \App\Models\Directorate::select('id', 'name', 'diocese_id')->with('diocese');

        // Super admins and provincial leaders can see every directorate.
        if ($user->canAccessFullDirectory()) {
            return response()->json($query->get());
        }

        if ($user->isDioceseAdmin()) {
            $query->where(function ($q) use ($user) {
                $q->where('diocese_id', $user->diocese_id)
                  ->orWhereNull('diocese_id');
            });

            return response()->json($query->get());
        }

        if ($user->isDirectorateAdmin()) {
            if ($user->directorate_id) {
                $query->where('id', $user->directorate_id);
            } else {
                $query->whereRaw('1 = 0');
            }

            return response()->json($query->get());
        }

        return response()->json([]);
    }
}
