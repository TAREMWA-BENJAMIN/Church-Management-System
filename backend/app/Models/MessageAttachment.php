<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MessageAttachment extends Model
{
    protected $fillable = [
        'message_id',
        'original_filename',
        'stored_path',
        'mime_type',
        'file_size',
    ];

    public function message()
    {
        return $this->belongsTo(Message::class);
    }

    // Return a publicly accessible URL for this attachment
    public function getUrlAttribute(): string
    {
        return asset('storage/' . $this->stored_path);
    }

    protected $appends = ['url'];
}
