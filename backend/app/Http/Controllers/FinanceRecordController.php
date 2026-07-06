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
        $user = $request->user();
        $query = FinanceRecord::with('parish');

        if ($user->isDioceseAdmin()) {
            $query->whereHas('parish.archdeaconry', function ($q) use ($user) {
                $q->where('diocese_id', $user->diocese_id);
            });
        } elseif ($user->isArchdeaconAdmin()) {
            $query->whereHas('parish', function ($q) use ($user) {
                $q->where('archdeaconry_id', $user->archdeaconry_id);
            });
        } elseif ($user->isParishAdmin()) {
            $query->where('parish_id', $user->parish_id);
        }

        $records = $query->orderByDesc('date')
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

        $user = $request->user();
        $parish = Parish::with('archdeaconry')->findOrFail($validated['parish_id']);
        
        $allowed = false;
        if ($user->isSuperAdmin()) $allowed = true;
        elseif ($user->isDioceseAdmin() && $parish->archdeaconry->diocese_id == $user->diocese_id) $allowed = true;
        elseif ($user->isArchdeaconAdmin() && $parish->archdeaconry_id == $user->archdeaconry_id) $allowed = true;
        elseif ($user->isParishAdmin() && $parish->id == $user->parish_id) $allowed = true;

        if (!$allowed) {
            abort(403, 'Unauthorized to post finances for this parish.');
        }

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
    public function parishes(Request $request)
    {
        $user = $request->user();
        $query = Parish::select('id', 'name')->orderBy('name');

        if ($user->isDioceseAdmin()) {
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
}
