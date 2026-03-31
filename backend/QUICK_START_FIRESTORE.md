# Quick Start - Laravel to Firebase Firestore Sync

## ✅ Setup Complete!

Your Laravel application is now connected to Firebase Firestore with automatic synchronization.

## How to Use

### 1. Run Seeders (Creates & Syncs Data)
```bash
php artisan db:seed
```
Data will be created in both your local database AND Firebase Firestore automatically.

### 2. Create Records Normally
```php
// In your code, create records like always
$student = Student::create([
    'name' => 'John Doe',
    'email' => 'john@example.com',
    'department' => 'CS',
    'year_level' => 1,
]);
// ✅ Automatically synced to Firestore!
```

### 3. Update Records
```php
$student = Student::find(1);
$student->update(['year_level' => 2]);
// ✅ Automatically synced to Firestore!
```

### 4. Delete Records
```php
$student->delete();
// ✅ Automatically deleted from Firestore!
```

### 5. Sync Existing Data
If you have old data, sync it:
```bash
php artisan firestore:sync
# or specific model:
php artisan firestore:sync --model=student
```

## Collections in Firestore

When you create records, they appear in Firestore:
- User records → `users` collection
- Student records → `students` collection
- Faculty records → `faculty` collection
- Announcements → `announcements` collection
- Events → `events` collection
- And so on...

## Where to Check

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click **Firestore Database** (left sidebar)
4. You'll see your collections and data syncing in real-time!

## Two-Way Access

- **Local**: Query using Laravel Eloquent for fast, local access
- **Firestore**: Real-time cloud backup with all your data

## Important Files

- **Models**: `/backend/app/Models/*.php` - All models now auto-sync
- **Guide**: `/backend/FIRESTORE_INTEGRATION_GUIDE.md` - Full documentation
- **Seeders**: `/backend/database/seeders/DatabaseSeeder.php` - Demo data

That's it! Everything now syncs automatically. 🚀
