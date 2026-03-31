<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Kreait\Firebase\Database;

class ScheduleController extends Controller
{
    protected $database;
    protected $scheduleRef;

    public function __construct(Database $database)
    {
        $this->database = $database;
        $this->scheduleRef = $this->database->getReference('schedules');
    }

    // 1. Show all faculties' schedules and details
    public function index()
    {
        $schedules = $this->scheduleRef->getValue() ?? [];
        return response()->json($schedules);
    }

    // 2. Reassign faculty to a schedule
    public function reassignFaculty(Request $request, $scheduleId)
    {
        $facultyId = $request->input('faculty_id');
        $this->scheduleRef->getChild($scheduleId)->update(['faculty_id' => $facultyId]);
        return response()->json(['message' => 'Faculty reassigned successfully']);
    }
}
