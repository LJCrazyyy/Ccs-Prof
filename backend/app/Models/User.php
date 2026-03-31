<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Services\FirestoreService;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected static $firestore;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'activity_log',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Bootstrap the model and bind model events for Firestore sync
     */
    protected static function boot()
    {
        parent::boot();

        // Sync to Firestore when created
        static::created(function ($model) {
            $model->syncToFirestore();
        });

        // Sync to Firestore when updated
        static::updated(function ($model) {
            $model->syncToFirestore();
        });

        // Delete from Firestore when deleted
        static::deleted(function ($model) {
            $model->deleteFromFirestore();
        });
    }

    /**
     * Get Firestore service instance
     */
    protected static function firestore(): FirestoreService
    {
        if (!self::$firestore) {
            self::$firestore = new FirestoreService();
        }
        return self::$firestore;
    }

    /**
     * Sync user data to Firestore
     */
    public function syncToFirestore()
    {
        try {
            $data = $this->toArray();
            self::firestore()->updateDocument('users', (string)$this->id, $data);
        } catch (\Exception $e) {
            \Log::error("Failed to sync user to Firestore: " . $e->getMessage());
        }
    }

    /**
     * Delete user from Firestore
     */
    public function deleteFromFirestore()
    {
        try {
            self::firestore()->deleteDocument('users', (string)$this->id);
        } catch (\Exception $e) {
            \Log::error("Failed to delete user from Firestore: " . $e->getMessage());
        }
    }
}
