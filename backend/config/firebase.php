<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Firebase Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your Firebase project credentials. You can find
    | these credentials in the Firebase Console under Project Settings >
    | Service Accounts. Download the JSON file and place it in
    | storage/app/firebase/service-account.json
    |
    */

    'credentials' => storage_path('app/firebase/service-account.json'),

    /*
    |--------------------------------------------------------------------------
    | Firebase Project ID
    |--------------------------------------------------------------------------
    |
    | The project ID of your Firebase project.
    |
    */

    'project_id' => env('FIREBASE_PROJECT_ID'),

    /*
    |--------------------------------------------------------------------------
    | Firebase Database URL
    |--------------------------------------------------------------------------
    |
    | The URL of your Firebase Realtime Database (if using).
    |
    */

    'database_url' => env('FIREBASE_DATABASE_URL'),

    /*
    |--------------------------------------------------------------------------
    | Firebase Storage Bucket
    |--------------------------------------------------------------------------
    |
    | The storage bucket for Firebase Cloud Storage.
    |
    */

    'storage_bucket' => env('FIREBASE_STORAGE_BUCKET'),
];