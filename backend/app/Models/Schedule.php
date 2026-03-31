<?php

namespace App\Models;

class Schedule extends FirestoreModel
{
    protected $fillable = [
        'subject_id', 'faculty_id', 'day', 'start_time', 'end_time', 'room'
    ];

    protected static function getFirestoreCollection(): string
    {
        return 'schedules';
    }
}
