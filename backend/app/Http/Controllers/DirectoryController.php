<?php

namespace App\Http\Controllers;

use App\Models\Diocese;
use App\Models\Parish;
use Illuminate\Http\Request;

class DirectoryController extends Controller
{
    public function dioceses()
    {
        $dioceses = Diocese::select('id', 'name')->get();
        return response()->json($dioceses);
    }

    public function parishes()
    {
        $parishes = Parish::select('id', 'name', 'archdeaconry_id')->with('archdeaconry.diocese')->get();
        return response()->json($parishes);
    }

    public function archdeaconries()
    {
        $archdeaconries = \App\Models\Archdeaconry::select('id', 'name', 'diocese_id')->with('diocese')->get();
        return response()->json($archdeaconries);
    }
}
