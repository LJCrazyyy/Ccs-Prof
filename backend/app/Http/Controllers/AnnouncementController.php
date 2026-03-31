<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Announcement;

class AnnouncementController extends Controller
{
    // API CRUD methods
    public function index(Request $request)
    {
        $query = Announcement::query();

        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        $announcements = $query->get();
        return response()->json($announcements);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'date' => 'required|date',
            'admin' => 'required|string|max:255',
            'priority' => 'required|in:low,medium,high',
            'category' => 'required|string|max:255',
        ]);

        $announcement = Announcement::create($validated);
        return response()->json($announcement, 201);
    }

    public function show($id)
    {
        $announcement = Announcement::findOrFail($id);
        return response()->json($announcement);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'date' => 'sometimes|required|date',
            'admin' => 'sometimes|required|string|max:255',
            'priority' => 'sometimes|required|in:low,medium,high',
            'category' => 'sometimes|required|string|max:255',
        ]);

        $announcement = Announcement::findOrFail($id);
        $announcement->update($validated);

        return response()->json($announcement);
    }

    public function destroy($id)
    {
        $announcement = Announcement::findOrFail($id);
        $announcement->delete();

        return response()->json(['message' => 'Announcement deleted successfully']);
    }
}