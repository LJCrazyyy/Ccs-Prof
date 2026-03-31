<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\FirestoreService;

class FacultyController extends Controller
{
    protected $firestoreService;

    public function __construct(FirestoreService $firestoreService)
    {
        $this->firestoreService = $firestoreService;
    }

    // 1. Add new faculty
    public function store(Request $request)
    {
        $data = $request->only(['name', 'email', 'subject', 'profile']);
        $newFaculty = $this->firestoreService->addDocument('faculties', $data);
        return response()->json(['id' => $newFaculty->id(), 'data' => $data], 201);
    }

    // 2. Assign faculty to a subject
    public function assignSubject(Request $request, $id)
    {
        $subject = $request->input('subject');
        $this->firestoreService->updateDocument('faculties', $id, ['subject' => $subject]);
        return response()->json(['message' => 'Subject assigned successfully']);
    }

    // 3. Edit faculty profile
    public function update(Request $request, $id)
    {
        $data = $request->only(['name', 'email', 'subject', 'profile']);
        $this->firestoreService->updateDocument('faculties', $id, $data);
        return response()->json(['message' => 'Profile updated successfully']);
    }

    // 4. Email/message a student (stub)
    public function messageStudent(Request $request)
    {
        // Implement email/message logic here
        return response()->json(['message' => 'Message sent (stub)']);
    }

    // 5. Assign faculty to an event
    public function assignEvent(Request $request, $id)
    {
        $eventId = $request->input('event_id');
        $faculty = $this->firestoreService->getDocument('faculties', $id);
        if ($faculty->exists()) {
            $data = $faculty->data();
            $eventIds = $data['event_ids'] ?? [];
            $eventIds[] = $eventId;
            $this->firestoreService->updateDocument('faculties', $id, ['event_ids' => $eventIds]);
            return response()->json(['message' => 'Event assigned successfully']);
        }
        return response()->json(['message' => 'Faculty not found'], 404);
    }
}
