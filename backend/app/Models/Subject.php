<?php

namespace App\Models;

class Subject extends FirestoreModel
{
    protected $fillable = [
        'name', 'code', 'description', 'credits', 'department'
    ];

    protected static function getFirestoreCollection(): string
    {
        return 'subjects';
    }
}
