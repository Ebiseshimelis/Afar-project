<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AboutController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\TenderController;
use App\Http\Controllers\Api\VacancyController;
use App\Http\Controllers\Api\JobApplicationController;
use App\Http\Controllers\Api\PublicationController;
use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\DirectorateController;
use App\Http\Controllers\Api\CityAdminController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ContactMessageController;
use App\Http\Controllers\Api\MultimediaController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FeedbackController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\AdminAccountController;
use App\Http\Controllers\Api\SystemSettingController;
use App\Http\Controllers\Api\StaffSetupController;
use App\Http\Controllers\Api\PortfolioController;
use App\Http\Controllers\Api\BackgroundController;

require __DIR__ . '/auth.php';


/*
|--------------------------------------------------------------------------
| Public API
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Staff Registration / Initial Setup
    |--------------------------------------------------------------------------
    |
    | These endpoints are intentionally public.
    |
    | 1. GET  /staff-setup/status
    |    Checks whether the first Super Admin still needs to be created.
    |
    | 2. POST /staff-setup/super-admin
    |    Creates the first Super Admin.
    |
    | 3. POST /staff-setup/admin
    |    Allows a person to request an Admin account.
    |
    | Admin registration creates:
    |
    |   role           = admin
    |   account_status = pending
    |   is_active      = false
    |   permissions    = []
    |
    | A Super Admin must approve the account before the Admin can
    | access the administrative panel.
    |
    */

    Route::prefix('staff-setup')->group(function () {

        /*
        | Admin registration status
        |
        | Super Admin setup is intentionally not exposed here.
        | The system has exactly one permanent Super Admin.
        */
        Route::get(
            '/status',
            [StaffSetupController::class, 'status']
        );

        /*
        | Admin account registration request
        */
        Route::post(
            '/admin',
            [StaffSetupController::class, 'registerAdmin']
        );
    });


    /*
    |--------------------------------------------------------------------------
    | Staff Authentication
    |--------------------------------------------------------------------------
    */

    Route::prefix('auth')->group(function () {

        /*
        | Admin / Super Admin login
        */
        Route::post(
            '/login',
            [AuthController::class, 'login']
        );

        /*
        | Authenticated staff
        */
        Route::middleware('auth:sanctum')->group(function () {

            Route::get(
                '/me',
                [AuthController::class, 'me']
            );

            Route::post(
                '/logout',
                [AuthController::class, 'logout']
            );
            Route::post(
                '/change-password',
                [AuthController::class, 'changePassword']
            );
        });
    });


    /*
    |--------------------------------------------------------------------------
    | Public Content
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/about',
        [AboutController::class, 'index']
    );

    Route::get(
        '/news',
        [NewsController::class, 'index']
    );

    Route::get(
        '/news/{news}',
        [NewsController::class, 'show']
    );

    Route::get('/ping', function () {
        return response()->json([
            'status' => 'ok',
        ], 200);
    })->name('api.ping');

    Route::get(
        '/events',
        [EventController::class, 'index']
    );

    Route::get(
        '/events/{event}',
        [EventController::class, 'show']
    );

    Route::get(
        '/tenders',
        [TenderController::class, 'index']
    );

    Route::get(
        '/tenders/{tender}',
        [TenderController::class, 'show']
    );

    Route::get(
        '/vacancies',
        [VacancyController::class, 'index']
    );

    Route::get(
        '/vacancies/{vacancy}',
        [VacancyController::class, 'show']
    );

    /*
    |--------------------------------------------------------------------------
    | Job Applications
    |--------------------------------------------------------------------------
    |
    | Public users submit applications for published vacancies.
    |
    */

    Route::post(
        '/vacancies/{vacancy}/applications',
        [JobApplicationController::class, 'store']
    );

    Route::get(
        '/publications',
        [PublicationController::class, 'index']
    );

    Route::get(
        '/publications/{publication}',
        [PublicationController::class, 'show']
    );

    Route::get(
        '/multimedia',
        [MultimediaController::class, 'index']
    );

    Route::get(
        '/multimedia/{multimedia}',
        [MultimediaController::class, 'show']
    );

    Route::get(
        '/announcements',
        [AnnouncementController::class, 'index']
    );

    Route::get(
        '/announcements/{announcement}',
        [AnnouncementController::class, 'show']
    );

    Route::get(
        '/directorates',
        [DirectorateController::class, 'index']
    );

    Route::get(
        '/directorates/{directorate}',
        [DirectorateController::class, 'show']
    );

    Route::get(
        '/city-admins',
        [CityAdminController::class, 'index']
    );

    Route::get(
        '/city-admins/{cityAdmin}',
        [CityAdminController::class, 'show']
    );

    Route::get(
        '/categories',
        [CategoryController::class, 'index']
    );

    Route::get('/portfolios', [PortfolioController::class, 'index']);
    Route::get('/backgrounds', [BackgroundController::class, 'index']);


    /*
    |--------------------------------------------------------------------------
    | Public Contact Message
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/contact',
        [ContactMessageController::class, 'store']
    );


    /*
    |--------------------------------------------------------------------------
    | Public Feedback
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/feedback',
        [FeedbackController::class, 'store']
    );
});


/*
|--------------------------------------------------------------------------
| Authenticated Staff Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')
    ->middleware('auth:sanctum')
    ->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Current User
    |--------------------------------------------------------------------------
    */

    Route::get('/user', function (Request $request) {
        return $request->user();
    });


    /*
    |--------------------------------------------------------------------------
    | News
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/news',
        [NewsController::class, 'store']
    )->middleware('permission:news.create');

    Route::put(
        '/news/{news}',
        [NewsController::class, 'update']
    )->middleware('permission:news.update');

    Route::delete(
        '/news/{news}',
        [NewsController::class, 'destroy']
    )->middleware('permission:news.delete');


    /*
    |--------------------------------------------------------------------------
    | Events
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/events',
        [EventController::class, 'store']
    )->middleware('permission:events.create');

    Route::put(
        '/events/{event}',
        [EventController::class, 'update']
    )->middleware('permission:events.update');

    Route::delete(
        '/events/{event}',
        [EventController::class, 'destroy']
    )->middleware('permission:events.delete');


    /*
    |--------------------------------------------------------------------------
    | Tenders
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/tenders',
        [TenderController::class, 'store']
    )->middleware('permission:tenders.create');

    Route::put(
        '/tenders/{tender}',
        [TenderController::class, 'update']
    )->middleware('permission:tenders.update');

    Route::delete(
        '/tenders/{tender}',
        [TenderController::class, 'destroy']
    )->middleware('permission:tenders.delete');


    /*
    |--------------------------------------------------------------------------
    | Vacancies
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/vacancies',
        [VacancyController::class, 'store']
    )->middleware('permission:vacancies.create');

    Route::put(
        '/vacancies/{vacancy}',
        [VacancyController::class, 'update']
    )->middleware('permission:vacancies.update');

    Route::delete(
        '/vacancies/{vacancy}',
        [VacancyController::class, 'destroy']
    )->middleware('permission:vacancies.delete');


    /*
    |--------------------------------------------------------------------------
    | Job Applications
    |--------------------------------------------------------------------------
    |
    | Admin / Super Admin application management.
    |
    */

    Route::get(
        '/job-applications',
        [JobApplicationController::class, 'index']
    )->middleware('permission:vacancies.view');

    Route::get(
        '/job-applications/{jobApplication}',
        [JobApplicationController::class, 'show']
    )->middleware('permission:vacancies.view');

    Route::put(
        '/job-applications/{jobApplication}',
        [JobApplicationController::class, 'update']
    )->middleware('permission:vacancies.update');

    Route::delete(
        '/job-applications/{jobApplication}',
        [JobApplicationController::class, 'destroy']
    )->middleware('permission:vacancies.delete');


    /*
    |--------------------------------------------------------------------------
    | Publications
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/publications',
        [PublicationController::class, 'store']
    )->middleware('permission:publications.create');

    Route::put(
        '/publications/{publication}',
        [PublicationController::class, 'update']
    )->middleware('permission:publications.update');

    Route::delete(
        '/publications/{publication}',
        [PublicationController::class, 'destroy']
    )->middleware('permission:publications.delete');


    /*
    |--------------------------------------------------------------------------
    | Multimedia
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/multimedia',
        [MultimediaController::class, 'store']
    )->middleware('permission:multimedia.create');

    Route::put(
        '/multimedia/{multimedia}',
        [MultimediaController::class, 'update']
    )->middleware('permission:multimedia.update');

    Route::delete(
        '/multimedia/{multimedia}',
        [MultimediaController::class, 'destroy']
    )->middleware('permission:multimedia.delete');

    Route::get('/portfolios/{portfolio}', [PortfolioController::class, 'show'])
        ->middleware('permission:portfolios.view');

    Route::post('/portfolios', [PortfolioController::class, 'store'])
        ->middleware('permission:portfolios.create');

    Route::match(['put', 'patch'], '/portfolios/{portfolio}', [PortfolioController::class, 'update'])
        ->middleware('permission:portfolios.update');

    Route::delete('/portfolios/{portfolio}', [PortfolioController::class, 'destroy'])
        ->middleware('permission:portfolios.delete');

    Route::post('/backgrounds/{section}', [BackgroundController::class, 'update'])
        ->middleware('permission:backgrounds.update');

    Route::delete('/backgrounds/{section}', [BackgroundController::class, 'destroy'])
        ->middleware('permission:backgrounds.update');


    /*
    |--------------------------------------------------------------------------
    | Announcements
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/announcements',
        [AnnouncementController::class, 'store']
    )->middleware('permission:announcements.create');

    Route::put(
        '/announcements/{announcement}',
        [AnnouncementController::class, 'update']
    )->middleware('permission:announcements.update');

    Route::delete(
        '/announcements/{announcement}',
        [AnnouncementController::class, 'destroy']
    )->middleware('permission:announcements.delete');


    /*
    |--------------------------------------------------------------------------
    | Directorates
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/directorates',
        [DirectorateController::class, 'store']
    )->middleware('permission:directorates.create');

    Route::put(
        '/directorates/{directorate}',
        [DirectorateController::class, 'update']
    )->middleware('permission:directorates.update');

    Route::delete(
        '/directorates/{directorate}',
        [DirectorateController::class, 'destroy']
    )->middleware('permission:directorates.delete');


    /*
    |--------------------------------------------------------------------------
    | City Administrations
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/city-admins',
        [CityAdminController::class, 'store']
    )->middleware('permission:city_admins.create');

    Route::put(
        '/city-admins/{cityAdmin}',
        [CityAdminController::class, 'update']
    )->middleware('permission:city_admins.update');

    Route::delete(
        '/city-admins/{cityAdmin}',
        [CityAdminController::class, 'destroy']
    )->middleware('permission:city_admins.delete');


    /*
    |--------------------------------------------------------------------------
    | Categories
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/categories',
        [CategoryController::class, 'store']
    )->middleware('permission:categories.create');

    Route::put(
        '/categories/{category}',
        [CategoryController::class, 'update']
    )->middleware('permission:categories.update');

    Route::delete(
        '/categories/{category}',
        [CategoryController::class, 'destroy']
    )->middleware('permission:categories.delete');


    /*
    |--------------------------------------------------------------------------
    | Contact Messages
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/contact-messages',
        [ContactMessageController::class, 'index']
    )->middleware('permission:messages.view');

    Route::get(
        '/contact-messages/{contactMessage}',
        [ContactMessageController::class, 'show']
    )->middleware('permission:messages.view');

    Route::delete(
        '/contact-messages/{contactMessage}',
        [ContactMessageController::class, 'destroy']
    )->middleware('permission:messages.delete');


    /*
    |--------------------------------------------------------------------------
    | Feedback
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/feedback',
        [FeedbackController::class, 'index']
    )->middleware('permission:feedback.view');

    Route::get(
        '/feedback/{feedback}',
        [FeedbackController::class, 'show']
    )->middleware('permission:feedback.view');

    Route::delete(
        '/feedback/{feedback}',
        [FeedbackController::class, 'destroy']
    )->middleware('permission:feedback.delete');


    /*
    |--------------------------------------------------------------------------
    | Notifications
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/notifications',
        [NotificationController::class, 'index']
    )->middleware('permission:notifications.view');

    Route::post(
        '/notifications',
        [NotificationController::class, 'store']
    )->middleware('permission:notifications.create');

    /*
     * IMPORTANT:
     * read-all must come before /notifications/{notification}.
     */
    Route::patch(
        '/notifications/read-all',
        [NotificationController::class, 'markAllAsRead']
    )->middleware('permission:notifications.update');

    Route::get(
        '/notifications/{notification}',
        [NotificationController::class, 'show']
    )->middleware('permission:notifications.view');

    Route::patch(
        '/notifications/{notification}/read',
        [NotificationController::class, 'markAsRead']
    )->middleware('permission:notifications.update');

    Route::delete(
        '/notifications/{notification}',
        [NotificationController::class, 'destroy']
    )->middleware('permission:notifications.delete');


    /*
    |--------------------------------------------------------------------------
    | Admin Account Management
    |--------------------------------------------------------------------------
    |
    | These routes are authenticated.
    |
    | The permission middleware makes these Super-Admin-only because
    | admin_accounts.* permissions are not granted to normal Admins.
    |
    */

    Route::get(
        '/admin/accounts',
        [AdminAccountController::class, 'index']
    )->middleware('permission:admin_accounts.view');

    Route::post(
        '/admin/accounts',
        [AdminAccountController::class, 'store']
    )->middleware('permission:admin_accounts.create');

    Route::put(
        '/admin/accounts/{user}',
        [AdminAccountController::class, 'update']
    )->middleware('permission:admin_accounts.update');


    Route::delete(
        '/admin/accounts/{user}',
        [AdminAccountController::class, 'destroy']
    )->middleware('permission:admin_accounts.delete');


    /*
    |--------------------------------------------------------------------------
    | Admin Users / Roles / Permissions
    |--------------------------------------------------------------------------
    |
    | AdminController itself performs the Super Admin check.
    |
    */

    Route::get(
        '/admin/users',
        [AdminController::class, 'users']
    );


    Route::get(
        '/admin/roles',
        [AdminController::class, 'roles']
    );

    Route::post(
        '/admin/roles',
        [AdminController::class, 'createRole']
    );
    Route::put(
        '/admin/roles/{role}',
        [AdminController::class, 'updateRole']
    );

    Route::delete(
        '/admin/roles/{role}',
        [AdminController::class, 'deleteRole']
    );

    Route::put(
        '/admin/users/{user}/role',
        [AdminController::class, 'assignRole']
    );

    Route::patch(
        '/admin/users/{user}/status',
        [AdminController::class, 'status']
    );

    Route::delete(
        '/admin/users/{user}',
        [AdminController::class, 'destroy']
    );


    /*
    |--------------------------------------------------------------------------
    | System Settings
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/admin/settings',
        [SystemSettingController::class, 'index']
    )->middleware('permission:settings.view');

    Route::put(
        '/admin/settings',
        [SystemSettingController::class, 'update']
    )->middleware('permission:settings.update');
});




