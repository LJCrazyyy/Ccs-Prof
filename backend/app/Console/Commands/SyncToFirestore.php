<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Student;
use App\Models\Faculty;
use App\Models\User;
use App\Models\Announcement;
use App\Models\Event;
use App\Models\Research;
use App\Models\Schedule;
use App\Models\Subject;

class SyncToFirestore extends Command
{
    protected $signature = 'firestore:sync {--model=}';
    protected $description = 'Sync existing database records to Firestore';

    public function handle()
    {
        $model = $this->option('model');

        if ($model) {
            $this->syncModel($model);
        } else {
            $this->syncAllModels();
        }
    }

    private function syncAllModels()
    {
        $this->info('🔄 Syncing all models to Firestore...');
        
        $models = [
            'User' => User::class,
            'Student' => Student::class,
            'Faculty' => Faculty::class,
            'Announcement' => Announcement::class,
            'Event' => Event::class,
            'Research' => Research::class,
            'Schedule' => Schedule::class,
            'Subject' => Subject::class,
        ];

        foreach ($models as $name => $class) {
            $this->syncModel($name);
        }

        $this->info('✅ All models synced to Firestore!');
    }

    private function syncModel($modelName)
    {
        $models = [
            'user' => User::class,
            'student' => Student::class,
            'faculty' => Faculty::class,
            'announcement' => Announcement::class,
            'event' => Event::class,
            'research' => Research::class,
            'schedule' => Schedule::class,
            'subject' => Subject::class,
        ];

        $modelName = strtolower($modelName);
        if (!isset($models[$modelName])) {
            $this->error("❌ Model '$modelName' not found");
            return;
        }

        $class = $models[$modelName];
        $count = $class::count();
        
        if ($count === 0) {
            $this->info("ℹ️  No records found for {$class}");
            return;
        }

        $this->info("🔄 Syncing {$count} {$class} record(s)...");
        
        try {
            if (method_exists($class, 'syncAllToFirestore')) {
                $class::syncAllToFirestore();
            } else {
                // For User model, sync individually
                foreach ($class::all() as $model) {
                    $model->syncToFirestore();
                }
            }
            $this->info("✅ {$class} synced successfully!");
        } catch (\Exception $e) {
            $this->error("❌ Error syncing {$class}: " . $e->getMessage());
        }
    }
}
