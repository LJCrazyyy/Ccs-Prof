# Firebase Firestore Integration Guide

## Overview

Your Laravel application is now fully integrated with Firebase Firestore! Any data created, updated, or deleted through your Laravel models will automatically sync to Firestore in real-time.

## How It Works

### Automatic Syncing

When you create or update records using Eloquent models, they automatically sync to Firestore:

```php
// This automatically creates a record in the 'users' Firestore collection
User::create([
    'name' => 'John Doe',
    'email' => 'john@example.com',
    'password' => bcrypt('password'),
]);

// This automatically syncs to the 'students' Firestore collection
Student::create([
    'name' => 'Jane Smith',
    'email' => 'jane@example.com',
    'department' => 'Computer Science',
    'year_level' => 1,
]);
```

### Collections in Firestore

The following Laravel models sync to these Firestore collections:

- **User** → `users`
- **Student** → `students`
- **Faculty** → `faculty`
- **Announcement** → `announcements`
- **Event** → `events`
- **Research** → `research`
- **Schedule** → `schedules`
- **Subject** → `subjects`

## Usage Examples

### Creating Records (Auto-syncs to Firestore)

```php
// All of these automatically sync to Firestore

// Create a student
$student = Student::create([
    'name' => 'John Doe',
    'email' => 'john@example.com',
    'department' => 'Computer Science',
    'year_level' => 1,
    'status' => 'active',
]);

// Create a faculty member
$faculty = Faculty::create([
    'name' => 'Dr. Smith',
    'email' => 'smith@example.com',
    'subject' => 'Web Development',
    'profile' => 'Ph.D. in Computer Science',
]);

// Create an announcement
$announcement = Announcement::create([
    'title' => 'System Announcement',
    'content' => 'Important update...',
    'date' => now(),
    'admin' => 'Admin Name',
    'priority' => 'high',
    'category' => 'general',
]);
```

### Running Seeders

When you run database seeders, all records are automatically synced to Firestore:

```bash
php artisan db:seed
```

This runs the seeder and automatically syncs all created records to Firestore.

### Syncing Existing Data

If you have existing data in your database that hasn't been synced yet, use the sync command:

```bash
# Sync all models to Firestore
php artisan firestore:sync

# Sync a specific model (user, student, faculty, etc.)
php artisan firestore:sync --model=student
```

### Updating Records

Updates automatically sync to Firestore:

```php
$student = Student::find(1);
$student->update([
    'status' => 'inactive',
    'year_level' => 2,
]);
// Automatically synced to Firestore!
```

### Deleting Records

Deletions automatically sync to Firestore:

```php
$student = Student::find(1);
$student->delete();
// Automatically deleted from Firestore!
```

## Creating new Models with Firestore Sync

To create a new model that automatically syncs to Firestore:

```php
<?php

namespace App\Models;

class MyModel extends FirestoreModel
{
    protected $fillable = ['name', 'email', 'description'];

    protected static function getFirestoreCollection(): string
    {
        return 'my_collection';
    }
}
```

## Two-Way Sync (Read from Firestore)

Currently, the integration handles write operations (Create, Update, Delete → Firestore). For reading data from Firestore directly, you can use the `FirestoreService`:

```php
use App\Services\FirestoreService;

$firestore = new FirestoreService();

// Get all documents from a collection
$students = $firestore->getCollection('students');

// Get a specific document
$student = $firestore->getDocument('students', 'document_id');

// Add a document directly to Firestore
$firestore->addDocument('students', [
    'name' => 'Direct Firestore Entry',
    'email' => 'direct@example.com',
]);
```

## Configuration

### Firebase Credentials

Ensure your `.env` file contains your Firebase credentials:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
```

Your Firebase service account JSON should be located at:
```
storage/app/firebase/service-account.json
```

## Error Handling

If any sync operation fails, errors are logged to `storage/logs/laravel.log`. Check the logs to troubleshoot:

```bash
tail -f storage/logs/laravel.log
```

## Database Synchronization

- **Local Database**: Used for querying, relationships, and caching
- **Firestore**: Real-time cloud database, synced automatically
- **Benefits**: Best of both worlds - local querying + cloud synchronization

## Testing

When running tests, Firestore sync is automatically handled by the model events. Mock the `FirestoreService` if needed for testing without Firebase credentials:

```php
use Mockery;

Mockery::mock(FirestoreService::class)
    ->shouldReceive('updateDocument')
    ->andReturn(true);
```

## Troubleshooting

### Data not syncing to Firestore

1. Check Firebase credentials in `.env`
2. Verify service account JSON exists at `storage/app/firebase/service-account.json`
3. Check logs at `storage/logs/laravel.log`
4. Ensure your Firebase project has Firestore Database enabled

### Missing collections in Firestore

Firestore collections are created automatically when the first document is added. If you want to pre-create collections, you can use the `firestore:sync` command.

## Next Steps

1. Configure your `.env` with Firebase credentials
2. Place your Firebase service account JSON file
3. Run `php artisan db:seed` to populate databases
4. Verify data appears in Firebase Console → Firestore Database
5. Start developing with automatic Firestore sync!
