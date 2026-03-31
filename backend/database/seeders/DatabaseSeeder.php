<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Student;
use App\Models\Faculty;
use App\Models\Announcement;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     * Data will automatically sync to Firestore on creation.
     */
    public function run(): void
    {
        // Create test user - automatically syncs to Firestore 'users' collection
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Create test students - automatically syncs to Firestore 'students' collection
        Student::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'department' => 'Computer Science',
            'year_level' => 1,
            'status' => 'active',
        ]);

        Student::create([
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'department' => 'Information Technology',
            'year_level' => 2,
            'status' => 'active',
        ]);

        // Create test faculty - automatically syncs to Firestore 'faculty' collection
        Faculty::create([
            'name' => 'Dr. Robert Johnson',
            'email' => 'robert@example.com',
            'subject' => 'Database Management',
            'profile' => 'Ph.D. in Computer Science',
        ]);

        // Create test announcements - automatically syncs to Firestore 'announcements' collection
        Announcement::create([
            'title' => 'Welcome to the System',
            'content' => 'This is a test announcement.',
            'date' => now(),
            'admin' => 'Test Admin',
            'priority' => 'high',
            'category' => 'general',
        ]);

        echo "\n✅ Seeding complete! Data has been synced to Firebase Firestore.\n";
    }
}

