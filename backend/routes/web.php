<?php

use Illuminate\Support\Facades\Route;
use App\Facades\Firebase;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ResearchController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\CourseController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/firebase-test', function () {
    try {
        $firestore = Firebase::firestore();
        // Test by listing collections or something simple
        $collections = $firestore->listCollections();
        return 'Firebase connected! Collections: ' . count($collections);
    } catch (\Exception $e) {
        return 'Firebase error: ' . $e->getMessage();
    }
});

// Faculty management routes
Route::post('/admin/faculty', [FacultyController::class, 'store']); // Add new faculty
Route::put('/admin/faculty/{id}/assign-subject', [FacultyController::class, 'assignSubject']); // Assign subject
Route::put('/admin/faculty/{id}', [FacultyController::class, 'update']); // Edit profile
Route::post('/admin/faculty/message-student', [FacultyController::class, 'messageStudent']); // Email/message student
Route::put('/admin/faculty/{id}/assign-event', [FacultyController::class, 'assignEvent']); // Assign event

// Student management routes
Route::get('/admin/students', [StudentController::class, 'index']); // Filter students
Route::post('/admin/students', [StudentController::class, 'store']); // Add student
Route::put('/admin/students/{id}', [StudentController::class, 'update']); // Edit student profile
Route::post('/admin/students/{id}/message', [StudentController::class, 'messageStudent']); // Email/message student

// Scheduling management routes
Route::get('/admin/schedules', [ScheduleController::class, 'index']); // Show all faculties' schedules
Route::put('/admin/schedules/{scheduleId}/reassign', [ScheduleController::class, 'reassignFaculty']); // Reassign faculty

// Subject management routes
Route::get('/admin/subjects', [SubjectController::class, 'index']); // Show all subjects per dept/year
Route::post('/admin/subjects', [SubjectController::class, 'store']); // Create subject
Route::get('/admin/subjects/{id}', [SubjectController::class, 'show']); // Get subject
Route::put('/admin/subjects/{id}', [SubjectController::class, 'update']); // Update subject
Route::delete('/admin/subjects/{id}', [SubjectController::class, 'destroy']); // Delete subject
Route::put('/admin/subjects/{id}/open-enrollment', [SubjectController::class, 'openEnrollment']); // Open for enrollment
Route::post('/admin/subjects/{id}/assign-regular', [SubjectController::class, 'assignToRegularStudents']); // Assign to regular students

// User management routes
Route::get('/admin/users', [UserController::class, 'index']); // List all users
Route::post('/admin/users', [UserController::class, 'store']); // Create user
Route::get('/admin/users/{id}', [UserController::class, 'show']); // Get user
Route::put('/admin/users/{id}', [UserController::class, 'update']); // Update user
Route::delete('/admin/users/{id}', [UserController::class, 'destroy']); // Delete user
Route::get('/admin/users/admins', [UserController::class, 'listAdmins']); // List admin users
Route::get('/admin/users/{id}/activity', [UserController::class, 'activityLog']); // User activity log

// Event management routes
Route::post('/admin/events', [EventController::class, 'store']); // Create event
Route::post('/admin/events/{id}/invite-department', [EventController::class, 'inviteDepartment']); // Invite department
Route::put('/admin/events/{id}/assign-faculties', [EventController::class, 'assignFaculties']); // Assign faculties

// Research management routes
Route::get('/admin/research', [ResearchController::class, 'index']); // Show all research
Route::put('/admin/research/{id}/approve', [ResearchController::class, 'approve']); // Approve research
Route::put('/admin/research/{id}/change-status', [ResearchController::class, 'changeStatus']); // Change status
Route::put('/admin/research/{id}/assign-panels', [ResearchController::class, 'assignPanels']); // Assign to panels
Route::put('/admin/research/{id}/assign-adviser', [ResearchController::class, 'assignAdviser']); // Assign to faculty for advisers

// Course management routes
Route::get('/admin/courses', [App\Http\Controllers\CourseController::class, 'index']);
Route::post('/admin/courses', [App\Http\Controllers\CourseController::class, 'store']);
Route::get('/admin/courses/{id}', [App\Http\Controllers\CourseController::class, 'show']);
Route::put('/admin/courses/{id}', [App\Http\Controllers\CourseController::class, 'update']);
Route::delete('/admin/courses/{id}', [App\Http\Controllers\CourseController::class, 'destroy']);

// Faculty management GET route
Route::get('/admin/faculties', [App\Http\Controllers\FacultyController::class, 'index']);

// Event management GET route
Route::get('/admin/events', [App\Http\Controllers\EventController::class, 'index']);

// Admin Dashboard routes
Route::get('/admin/dashboard/stats', [AdminDashboardController::class, 'getStats']); // Fetch dashboard statistics
