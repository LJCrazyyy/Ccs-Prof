<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Services\FirestoreService;

class UserController extends Controller
{
    protected $firestoreService;

    public function __construct(FirestoreService $firestoreService)
    {
        $this->firestoreService = $firestoreService;
    }

    // 1. User activity log
    public function activityLog($id)
    {
        $document = $this->firestoreService->getDocument('users', $id);
        if ($document->exists()) {
            $data = $document->data();
            return response()->json(['activity_log' => $data['activity_log'] ?? []]);
        }
        return response()->json(['message' => 'User not found'], 404);
    }

    // 2. List all admin users
    public function listAdmins()
    {
        $documents = $this->firestoreService->getCollection('users');
        $admins = [];
        foreach ($documents as $document) {
            $data = $document->data();
            if ($data['role'] === 'admin') {
                $admins[] = $data;
            }
        }
        return response()->json($admins);
    }

    // API CRUD methods
    public function index()
    {
        $documents = $this->firestoreService->getCollection('users');
        $users = [];
        foreach ($documents as $document) {
            $data = $document->data();
            $data['id'] = $document->id();
            $users[] = $data;
        }
        return response()->json($users);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,faculty,student',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role' => $validated['role'],
            'activity_log' => [],
        ]);

        return response()->json($user, 201);
    }

    public function show($id)
    {
        $document = $this->firestoreService->getDocument('users', $id);
        if ($document->exists()) {
            $data = $document->data();
            $data['id'] = $document->id();
            return response()->json($data);
        }
        return response()->json(['message' => 'User not found'], 404);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $id,
            'role' => 'sometimes|required|in:admin,faculty,student',
        ]);

        $user = User::findOrFail($id);
        $user->update($validated);

        return response()->json($user);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}
