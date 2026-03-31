<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Kreait\Firebase\Database;

class AdminDashboardController extends Controller
{
    protected $database;

    public function __construct(Database $database)
    {
        $this->database = $database;
    }

    // Fetch dashboard statistics
    public function getStats()
    {
        $students = $this->database->getReference('students')->getSnapshot()->numChildren();
        $faculty = $this->database->getReference('faculties')->getSnapshot()->numChildren();
        $classes = $this->database->getReference('schedules')->getSnapshot()->numChildren();
        $programs = $this->database->getReference('subjects')->getSnapshot()->numChildren();
        $events = $this->database->getReference('events')->getSnapshot()->numChildren();
        $announcements = $this->database->getReference('announcements')->getSnapshot()->numChildren();

        return response()->json([
            'total_students' => $students,
            'total_faculty' => $faculty,
            'active_classes' => $classes,
            'total_programs' => $programs,
            'total_events' => $events,
            'total_announcements' => $announcements,
        ]);
    }
}
