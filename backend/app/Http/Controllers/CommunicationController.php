<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\MessageAttachment;
use App\Models\MessageRecipient;
use App\Models\OrganizationUnit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CommunicationController extends Controller
{
    /**
     * Get the organization unit IDs that belong to the current user.
     */
    private function getUserUnitIds(): array
    {
        $user = Auth::user();
        if ($user->is_super_admin) {
            return OrganizationUnit::withoutGlobalScope('organizationUnitSecurity')
                ->pluck('id')->toArray();
        }
        return $user->roleAssignments()->pluck('organization_unit_id')->toArray();
    }

    /**
     * Inbox: messages received by the current user's unit(s).
     */
    public function index()
    {
        $unitIds = $this->getUserUnitIds();

        // Get root-level messages (parent_id = null) where current user's unit is a recipient
        $inbox = Message::with(['senderUnit', 'senderUser', 'recipients.organizationUnit', 'attachments'])
            ->whereNull('parent_id')
            ->whereHas('recipients', fn($q) => $q->whereIn('organization_unit_id', $unitIds))
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($msg) use ($unitIds) {
                $recipientRow = $msg->recipients
                    ->whereIn('organization_unit_id', $unitIds)
                    ->first();
                $msg->is_read = $recipientRow?->is_read ?? true;
                $msg->reply_count = Message::where('parent_id', $msg->id)->count();
                return $msg;
            });

        $sent = Message::with(['senderUnit', 'senderUser', 'recipients.organizationUnit'])
            ->whereNull('parent_id')
            ->whereIn('sender_unit_id', $unitIds)
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($msg) {
                $msg->reply_count = Message::where('parent_id', $msg->id)->count();
                return $msg;
            });

        $units = OrganizationUnit::withoutGlobalScope('organizationUnitSecurity')
            ->orderBy('name')
            ->get(['id', 'name']);

        $myUnitIds = array_values($unitIds);

        $unreadCount = MessageRecipient::whereIn('organization_unit_id', $unitIds)
            ->where('is_read', false)
            ->whereHas('message', fn($q) => $q->whereNull('parent_id'))
            ->count();

        return Inertia::render('Communications/Index', [
            'inbox'       => $inbox,
            'sent'        => $sent,
            'units'       => $units,
            'myUnitIds'   => $myUnitIds,
            'unreadCount' => $unreadCount,
        ]);
    }

    /**
     * Show a full message thread (original + all replies).
     */
    public function show($id)
    {
        $unitIds = $this->getUserUnitIds();

        $message = Message::with([
            'senderUnit',
            'senderUser',
            'recipients.organizationUnit',
            'attachments',
            'replies.senderUnit',
            'replies.senderUser',
            'replies.attachments',
            'replies.recipients.organizationUnit',
        ])->findOrFail($id);

        // Mark as read for the user's units
        MessageRecipient::where('message_id', $message->id)
            ->whereIn('organization_unit_id', $unitIds)
            ->where('is_read', false)
            ->update(['is_read' => true, 'read_at' => now()]);

        $units = OrganizationUnit::withoutGlobalScope('organizationUnitSecurity')
            ->orderBy('name')
            ->get(['id', 'name']);

        $myUnitIds = array_values($unitIds);

        return Inertia::render('Communications/Show', [
            'message'   => $message,
            'units'     => $units,
            'myUnitIds' => $myUnitIds,
        ]);
    }

    /**
     * Compose and send a new message.
     */
    public function store(Request $request)
    {
        $request->validate([
            'subject'       => 'required|string|max:255',
            'body'          => 'required|string',
            'sender_unit_id'=> 'required|exists:organization_units,id',
            'recipient_ids' => 'required|array|min:1',
            'recipient_ids.*'=> 'exists:organization_units,id',
            'attachments.*' => 'nullable|file|max:51200', // 50MB per file
        ]);

        DB::transaction(function () use ($request) {
            $message = Message::create([
                'subject'        => $request->subject,
                'body'           => $request->body,
                'sender_unit_id' => $request->sender_unit_id,
                'sender_user_id' => Auth::id(),
                'parent_id'      => null,
            ]);

            foreach ($request->recipient_ids as $unitId) {
                MessageRecipient::create([
                    'message_id'           => $message->id,
                    'organization_unit_id' => $unitId,
                    'is_read'              => false,
                ]);
            }

            $this->handleAttachments($request, $message->id);
        });

        return redirect()->route('communications.index')->with('success', 'Message sent successfully.');
    }

    /**
     * Reply to an existing message thread.
     */
    public function reply(Request $request, $id)
    {
        $request->validate([
            'body'           => 'required|string',
            'sender_unit_id' => 'required|exists:organization_units,id',
            'recipient_ids'  => 'required|array|min:1',
            'recipient_ids.*'=> 'exists:organization_units,id',
            'attachments.*'  => 'nullable|file|max:51200',
        ]);

        $parent = Message::findOrFail($id);

        DB::transaction(function () use ($request, $parent) {
            $reply = Message::create([
                'subject'        => 'Re: ' . $parent->subject,
                'body'           => $request->body,
                'sender_unit_id' => $request->sender_unit_id,
                'sender_user_id' => Auth::id(),
                'parent_id'      => $parent->id,
            ]);

            foreach ($request->recipient_ids as $unitId) {
                MessageRecipient::create([
                    'message_id'           => $reply->id,
                    'organization_unit_id' => $unitId,
                    'is_read'              => false,
                ]);
            }

            $this->handleAttachments($request, $reply->id);
        });

        return redirect()->route('communications.show', $id)->with('success', 'Reply sent.');
    }

    /**
     * Delete a message (only sender can delete).
     */
    public function destroy($id)
    {
        $unitIds = $this->getUserUnitIds();
        $message = Message::findOrFail($id);

        if (!in_array($message->sender_unit_id, $unitIds) && !Auth::user()->is_super_admin) {
            abort(403);
        }

        // Delete attachment files from storage
        foreach ($message->attachments as $attachment) {
            Storage::disk('public')->delete($attachment->stored_path);
        }

        $message->delete();

        return redirect()->route('communications.index')->with('success', 'Message deleted.');
    }

    /**
     * Get unread count — used by AppLayout to show badge.
     */
    public function unreadCount()
    {
        $unitIds = $this->getUserUnitIds();
        $count = MessageRecipient::whereIn('organization_unit_id', $unitIds)
            ->where('is_read', false)
            ->whereHas('message', fn($q) => $q->whereNull('parent_id'))
            ->count();

        return response()->json(['count' => $count]);
    }

    /**
     * Handle file upload and save attachments.
     */
    private function handleAttachments(Request $request, int $messageId): void
    {
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('attachments', 'public');
                MessageAttachment::create([
                    'message_id'        => $messageId,
                    'original_filename' => $file->getClientOriginalName(),
                    'stored_path'       => $path,
                    'mime_type'         => $file->getMimeType(),
                    'file_size'         => $file->getSize(),
                ]);
            }
        }
    }
}
