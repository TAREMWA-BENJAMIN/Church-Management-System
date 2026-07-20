<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Directorate;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DirectorateController extends Controller
{
    public function index()
    {
        return response()->json(Directorate::orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:191', 'unique:directorates,name'],
            'description' => ['nullable', 'string'],
            'diocese_id' => ['nullable', 'integer', 'exists:dioceses,id'],
            'is_active' => ['nullable', 'boolean'],
            'revenue' => ['required', 'numeric', 'min:0'],
        ]);

        $directorate = Directorate::create(array_merge($data, ['is_active' => $data['is_active'] ?? true]));

        return response()->json($directorate, 201);
    }

    public function show($id)
    {
        $d = Directorate::findOrFail($id);
        return response()->json($d);
    }

    public function update(Request $request, $id)
    {
        $directorate = Directorate::findOrFail($id);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:191', Rule::unique('directorates', 'name')->ignore($directorate->id)],
            'description' => ['nullable', 'string'],
            'diocese_id' => ['nullable', 'integer', 'exists:dioceses,id'],
            'is_active' => ['nullable', 'boolean'],
            'revenue' => ['required', 'numeric', 'min:0'],
        ]);

        $directorate->update($data);

        return response()->json($directorate);
    }

    public function destroy($id)
    {
        $directorate = Directorate::findOrFail($id);
        $directorate->delete();
        return response()->json(null, 204);
    }
}
