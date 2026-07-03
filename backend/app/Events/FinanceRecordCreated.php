<?php

namespace App\Events;

use App\Models\FinanceRecord;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class FinanceRecordCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public FinanceRecord $record;

    public function __construct(FinanceRecord $record)
    {
        $this->record = $record->load('parish');
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): Channel
    {
        return new Channel('finance');
    }

    /**
     * The name of the event sent to the client.
     */
    public function broadcastAs(): string
    {
        return 'FinanceRecordCreated';
    }

    /**
     * Data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'id'          => $this->record->id,
            'parish_id'   => $this->record->parish_id,
            'parish_name' => $this->record->parish?->name ?? 'N/A',
            'type'        => $this->record->type,
            'category'    => $this->record->category,
            'amount'      => (float) $this->record->amount,
            'description' => $this->record->description,
            'date'        => $this->record->date,
            'created_at'  => $this->record->created_at?->toIso8601String(),
        ];
    }
}
