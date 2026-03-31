<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;

class StudentController extends Controller
{
    // API CRUD methods
    public function index(Request $request)
    {
        $query = Student::query();

        if ($request->has('department')) {
            $query->where('department', $request->department);
        }

        if ($request->has('year_level')) {
            $query->where('year_level', $request->year_level);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $students = $query->get();
        return response()->json($students);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:students,email',
            'department' => 'required|string|max:255',
            'year_level' => 'required|integer|min:1|max:4',
            'status' => 'required|in:active,inactive,graduated',
            'profile' => 'nullable|string',
        ]);

        $student = Student::create($validated);
        return response()->json($student, 201);
    }

    public function show($id)
    {
        $student = Student::findOrFail($id);
        return response()->json($student);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:students,email,' . $id,
            'department' => 'sometimes|required|string|max:255',
            'year_level' => 'sometimes|required|integer|min:1|max:4',
            'status' => 'sometimes|required|in:active,inactive,graduated',
            'profile' => 'nullable|string',
        ]);

        $student = Student::findOrFail($id);
        $student->update($validated);

        return response()->json($student);
    }

    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        $student->delete();

        return response()->json(['message' => 'Student deleted successfully']);
    }
        $this->firestoreService->updateDocument('students', $id, $data);
        return response()->json(['message' => 'Profile updated successfully']);
    }

    // 4. Email/message student (stub)
    public function messageStudent(Request $request, $id)
    {
        // Implement email/message logic here
        return response()->json(['message' => 'Message sent (stub)']);
    }
}
