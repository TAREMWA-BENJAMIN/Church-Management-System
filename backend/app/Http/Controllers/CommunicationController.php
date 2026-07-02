<?php

namespace App\Http\Controllers;

use App\Models\Communication;
use Illuminate\Http\Request;

class CommunicationController extends Controller
{
    public function index(Request $request)
    {
        $entityType = $request->query('entity_type'); // 'App\Models\Diocese' or 'App\Models\Parish'
        $entityId = $request->query('entity_id');
        $tab = $request->query('tab', 'inbox'); // 'inbox' or 'sent'

        if (!$entityType || !$entityId) {
            return response()->json(['error' => 'Missing entity context'], 400);
        }

        $query = Communication::query()->with(['sender', 'receiver']);

        if ($tab === 'sent') {
            $query->where('sender_type', $entityType)->where('sender_id', $entityId);
        } else {
            $query->where('receiver_type', $entityType)->where('receiver_id', $entityId);
        }

        $communications = $query->latest()->get();

        return response()->json($communications);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sender_type' => 'required|string',
            'sender_id' => 'required|integer',
            'receiver_type' => 'required|string',
            'receiver_id' => 'required|integer',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $communication = Communication::create($validated);

        return response()->json($communication, 201);
    }

    public function markAsRead(Request $request, $id)
    {
        $communication = Communication::findOrFail($id);
        
        $communication->update(['is_read' => true]);

        return response()->json($communication);
    }
}
