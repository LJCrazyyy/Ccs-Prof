<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Kreait\Firebase\Database;

class EventController extends Controller
{
    protected $database;
    protected $eventRef;

    public function __construct(Database $database)
    {
        $this->database = $database;
        $this->eventRef = $this->database->getReference('events');
    }

    // 1. Create event
    public function store(Request $request)
    {
        $data = $request->only(['name', 'description', 'departments', 'faculty_ids', 'date', 'status']);
        $newEvent = $this->eventRef->push($data);
        return response()->json(['id' => $newEvent->getKey(), 'data' => $data], 201);
    }

    // 2. Invite department for schoolwide event (stub)
    public function inviteDepartment(Request $request, $id)
    {
        // Implement logic to invite department
        return response()->json(['message' => 'Department invited (stub)']);
    }

    // 3. Assign faculties to event
    public function assignFaculties(Request $request, $id)
    {
        $facultyIds = $request->input('faculty_ids', []);
        $this->eventRef->getChild($id)->update(['faculty_ids' => $facultyIds]);
        return response()->json(['message' => 'Faculties assigned']);
    }
}
