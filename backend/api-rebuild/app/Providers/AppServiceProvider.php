<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\ServiceProvider;
use App\Models\Announcement;
use App\Models\Category;
use App\Models\CityAdmin;
use App\Models\Directorate;
use App\Models\Event;
use App\Models\Feedback;
use App\Models\Multimedia;
use App\Models\News;
use App\Models\Publication;
use App\Models\Tender;
use App\Models\Vacancy;
use App\Observers\ActivityObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            return config('app.frontend_url')."/password-reset/$token?email={$notifiable->getEmailForPasswordReset()}";
        });

        Announcement::observe(ActivityObserver::class);
        Category::observe(ActivityObserver::class);
        CityAdmin::observe(ActivityObserver::class);
        Directorate::observe(ActivityObserver::class);
        Event::observe(ActivityObserver::class);
        Feedback::observe(ActivityObserver::class);
        Multimedia::observe(ActivityObserver::class);
        News::observe(ActivityObserver::class);
        Publication::observe(ActivityObserver::class);
        Tender::observe(ActivityObserver::class);
        Vacancy::observe(ActivityObserver::class);
    }
}
