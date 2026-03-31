<?php

namespace App\Models;

class Announcement extends FirestoreModel
{
    protected $fillable = [
        'title', 'content', 'date', 'admin', 'priority', 'category'
    ];

    protected static function getFirestoreCollection(): string
    {
        return 'announcements';
    }
}
