<?php

namespace App\Models;

class Event extends FirestoreModel
{
    protected $fillable = [
        'name', 'description', 'date', 'location', 'organizer'
    ];

    protected static function getFirestoreCollection(): string
    {
        return 'events';
    }
}
