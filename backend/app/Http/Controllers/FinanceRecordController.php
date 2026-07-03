<?php

namespace App\Http\Controllers;

use App\Events\FinanceRecordCreated;
use App\Models\FinanceRecord;
use App\Models\Parish;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class FinanceRecordController extends Controller
{
    /**
     * Return recent finance records with parish info.
     */
    public function index(Request $request)
    {
        $records = FinanceRecord::with('parish')
            ->orderByDesc('date')
            ->orderByDesc('created_at')
            ->limit(50)
            ->get()
            ->map(fn ($r) => [
                'id'          => $r->id,
                'parish_id'   => $r->parish_id,
                'parish_name' => $r->parish?->name ?? 'N/A',
                'type'        => $r->type,
                'category'    => $r->category,
                'amount'      => (float) $r->amount,
                'description' => $r->description,
                'date'        => $r->date,
                'created_at'  => $r->created_at?->toIso8601String(),
            ]);

        return response()->json($records);
    }

    /**
     * Create a new finance record and broadcast the event.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'parish_id'   => ['required', 'integer', 'exists:parishes,id'],
            'type'        => ['required', Rule::in(['income', 'expenditure'])],
            'category'    => ['required', 'string', 'max:100'],
            'amount'      => ['required', 'numeric', 'min:0'],
            'description' => ['nullable', 'string', 'max:500'],
            'date'        => ['required', 'date'],
        ]);

        $record = FinanceRecord::create($validated);

        // Broadcast to all connected clients
        broadcast(new FinanceRecordCreated($record))->toOthers();

        return response()->json([
            'id'          => $record->id,
            'parish_id'   => $record->parish_id,
            'parish_name' => $record->parish?->name ?? 'N/A',
            'type'        => $record->type,
            'category'    => $record->category,
            'amount'      => (float) $record->amount,
            'description' => $record->description,
            'date'        => $record->date,
            'created_at'  => $record->created_at?->toIso8601String(),
        ], 201);
    }

    /**
     * Return all parishes for the record form dropdown.
     */
    public function parishes()
    {
        return response()->json(Parish::select('id', 'name')->orderBy('name')->get());
    }
}
