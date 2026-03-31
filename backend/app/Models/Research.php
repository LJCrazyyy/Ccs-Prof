<?php

namespace App\Models;

class Research extends FirestoreModel
{
    protected $fillable = [
        'title', 'description', 'authors', 'publication_date', 'status'
    ];

    protected static function getFirestoreCollection(): string
    {
        return 'research';
    }
}
