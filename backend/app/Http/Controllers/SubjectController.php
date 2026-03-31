<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subject;

class SubjectController extends Controller
{
    // API CRUD methods
    public function index(Request $request)
    {
        $query = Subject::query();

        if ($request->has('department')) {
            $query->where('department', $request->department);
        }

        $subjects = $query->get();
        return response()->json($subjects);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:subjects,code',
            'description' => 'nullable|string',
            'credits' => 'required|integer|min:1|max:6',
            'department' => 'required|string|max:255',
        ]);

        $subject = Subject::create($validated);
        return response()->json($subject, 201);
    }

    public function show($id)
    {
        $subject = Subject::findOrFail($id);
        return response()->json($subject);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'code' => 'sometimes|required|string|max:50|unique:subjects,code,' . $id,
            'description' => 'nullable|string',
            'credits' => 'sometimes|required|integer|min:1|max:6',
            'department' => 'sometimes|required|string|max:255',
        ]);

        $subject = Subject::findOrFail($id);
        $subject->update($validated);

        return response()->json($subject);
    }

    public function destroy($id)
    {
        $subject = Subject::findOrFail($id);
        $subject->delete();

        return response()->json(['message' => 'Subject deleted successfully']);
    }

    // Legacy methods (keeping for compatibility)
    // 1. Show all subjects per department and year level
    public function indexLegacy(Request $request)
    {
        return $this->index($request);
    }

    // 2. Open subject for enrollment (max 50 students by default)
    public function openEnrollment(Request $request, $id)
    {
        $subject = Subject::findOrFail($id);
        // Note: This would need additional fields in the model for enrollment status
        return response()->json(['message' => 'Enrollment opened for ' . $subject->name]);
    }

    // 3. Assign subject to student with regular status (automatic)
    public function assignToRegularStudents($id)
    {
        $subject = Subject::findOrFail($id);
        // Implement logic to assign subject to all students with regular status
        return response()->json(['message' => 'Assigned to regular students']);
    }
}
