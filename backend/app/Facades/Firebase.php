<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @method static \Kreait\Firebase\Contract\Database database()
 * @method static \Kreait\Firebase\Contract\Auth auth()
 * @method static \Kreait\Firebase\Contract\Storage storage()
 * @method static \Kreait\Firebase\Contract\Firestore firestore()
 */
class Firebase extends Facade
{
    /**
     * Get the registered name of the component.
     */
    protected static function getFacadeAccessor(): string
    {
        return 'firebase';
    }
}