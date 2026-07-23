<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'subject',
        'body',
        'sender_unit_id',
        'sender_user_id',
        'parent_id',
    ];

    // The organization unit that sent this message
    public function senderUnit()
    {
        return $this->belongsTo(OrganizationUnit::class, 'sender_unit_id');
    }

    // The user who composed/sent this message
    public function senderUser()
    {
        return $this->belongsTo(User::class, 'sender_user_id');
    }

    // The parent message (if this is a reply)
    public function parent()
    {
        return $this->belongsTo(Message::class, 'parent_id');
    }

    // Direct replies to this message
    public function replies()
    {
        return $this->hasMany(Message::class, 'parent_id')->with(['senderUnit', 'senderUser', 'attachments'])->orderBy('created_at', 'asc');
    }

    // Recipient organization units for this message
    public function recipients()
    {
        return $this->hasMany(MessageRecipient::class);
    }

    // Attachments on this message
    public function attachments()
    {
        return $this->hasMany(MessageAttachment::class);
    }

    // Root message of the thread (for replies, follows parent chain)
    public function root()
    {
        return $this->parent_id ? $this->parent : $this;
    }
}
