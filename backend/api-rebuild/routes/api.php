<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AboutController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\TenderController;
use App\Http\Controllers\Api\VacancyController;
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
use App\Http\Controllers\Api\PermissionController;

require __DIR__.'/auth.php';

Route::prefix('v1')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Staff Authentication
    |--------------------------------------------------------------------------
    */

    Route::prefix('auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);

        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/me', [AuthController::class, 'me']);
            Route::post('/logout', [AuthController::class, 'logout']);
        });
    });

    /*
    |--------------------------------------------------------------------------
    | Public Routes
    |--------------------------------------------------------------------------
    */

    Route::get('/about', [AboutController::class, 'index']);

    Route::get('/news', [NewsController::class, 'index']);
    Route::get('/news/{news}', [NewsController::class, 'show']);

    Route::get('/ping', function () {
        return response()->json([
            'status' => 'ok',
        ], 200);
    })->name('api.ping');

    Route::get('/events', [EventController::class, 'index']);
    Route::get('/events/{event}', [EventController::class, 'show']);

    Route::get('/tenders', [TenderController::class, 'index']);
    Route::get('/tenders/{tender}', [TenderController::class, 'show']);

    Route::get('/vacancies', [VacancyController::class, 'index']);
    Route::get('/vacancies/{vacancy}', [VacancyController::class, 'show']);

    Route::get('/publications', [PublicationController::class, 'index']);
    Route::get('/publications/{publication}', [PublicationController::class, 'show']);

    Route::get('/multimedia', [MultimediaController::class, 'index']);
    Route::get('/multimedia/{multimedia}', [MultimediaController::class, 'show']);

    Route::get('/announcements', [AnnouncementController::class, 'index']);
    Route::get('/announcements/{announcement}', [AnnouncementController::class, 'show']);

    Route::get('/directorates', [DirectorateController::class, 'index']);
    Route::get('/directorates/{directorate}', [DirectorateController::class, 'show']);

    Route::get('/city-admins', [CityAdminController::class, 'index']);
    Route::get('/city-admins/{cityAdmin}', [CityAdminController::class, 'show']);

    Route::get('/categories', [CategoryController::class, 'index']);

    Route::post('/contact', [ContactMessageController::class, 'store']);

    Route::post('/feedback', [FeedbackController::class, 'store']);
});

/*
|--------------------------------------------------------------------------
| Authenticated Staff Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->middleware('auth:sanctum')->group(function () {

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    /*
    |--------------------------------------------------------------------------
    | News
    |--------------------------------------------------------------------------
    */

    Route::post('/news', [NewsController::class, 'store'])
        ->middleware('permission:news.create');

    Route::put('/news/{news}', [NewsController::class, 'update'])
        ->middleware('permission:news.update');

    Route::delete('/news/{news}', [NewsController::class, 'destroy'])
        ->middleware('permission:news.delete');

    /*
    |--------------------------------------------------------------------------
    | Events
    |--------------------------------------------------------------------------
    */

    Route::post('/events', [EventController::class, 'store'])
        ->middleware('permission:events.create');

    Route::put('/events/{event}', [EventController::class, 'update'])
        ->middleware('permission:events.update');

    Route::delete('/events/{event}', [EventController::class, 'destroy'])
        ->middleware('permission:events.delete');

    /*
    |--------------------------------------------------------------------------
    | Tenders
    |--------------------------------------------------------------------------
    */

    Route::post('/tenders', [TenderController::class, 'store'])
        ->middleware('permission:tenders.create');

    Route::put('/tenders/{tender}', [TenderController::class, 'update'])
        ->middleware('permission:tenders.update');

    Route::delete('/tenders/{tender}', [TenderController::class, 'destroy'])
        ->middleware('permission:tenders.delete');

    /*
    |--------------------------------------------------------------------------
    | Vacancies
    |--------------------------------------------------------------------------
    */

    Route::post('/vacancies', [VacancyController::class, 'store'])
        ->middleware('permission:vacancies.create');

    Route::put('/vacancies/{vacancy}', [VacancyController::class, 'update'])
        ->middleware('permission:vacancies.update');

    Route::delete('/vacancies/{vacancy}', [VacancyController::class, 'destroy'])
        ->middleware('permission:vacancies.delete');

    /*
    |--------------------------------------------------------------------------
    | Publications
    |--------------------------------------------------------------------------
    */

    Route::post('/publications', [PublicationController::class, 'store'])
        ->middleware('permission:publications.create');

    Route::put('/publications/{publication}', [PublicationController::class, 'update'])
        ->middleware('permission:publications.update');

    Route::delete('/publications/{publication}', [PublicationController::class, 'destroy'])
        ->middleware('permission:publications.delete');

    /*
    |--------------------------------------------------------------------------
    | Multimedia
    |--------------------------------------------------------------------------
    */

    Route::post('/multimedia', [MultimediaController::class, 'store'])
        ->middleware('permission:multimedia.create');

    Route::put('/multimedia/{multimedia}', [MultimediaController::class, 'update'])
        ->middleware('permission:multimedia.update');

    Route::delete('/multimedia/{multimedia}', [MultimediaController::class, 'destroy'])
        ->middleware('permission:multimedia.delete');

    /*
    |--------------------------------------------------------------------------
    | Announcements
    |--------------------------------------------------------------------------
    */

    Route::post('/announcements', [AnnouncementController::class, 'store'])
        ->middleware('permission:announcements.create');

    Route::put('/announcements/{announcement}', [AnnouncementController::class, 'update'])
        ->middleware('permission:announcements.update');

    Route::delete('/announcements/{announcement}', [AnnouncementController::class, 'destroy'])
        ->middleware('permission:announcements.delete');

    /*
    |--------------------------------------------------------------------------
    | Directorates
    |--------------------------------------------------------------------------
    */

    Route::post('/directorates', [DirectorateController::class, 'store'])
        ->middleware('permission:directorates.create');

    Route::put('/directorates/{directorate}', [DirectorateController::class, 'update'])
        ->middleware('permission:directorates.update');

    Route::delete('/directorates/{directorate}', [DirectorateController::class, 'destroy'])
        ->middleware('permission:directorates.delete');

    /*
    |--------------------------------------------------------------------------
    | City Administrations
    |--------------------------------------------------------------------------
    */

    Route::post('/city-admins', [CityAdminController::class, 'store'])
        ->middleware('permission:city_admins.create');

    Route::put('/city-admins/{cityAdmin}', [CityAdminController::class, 'update'])
        ->middleware('permission:city_admins.update');

    Route::delete('/city-admins/{cityAdmin}', [CityAdminController::class, 'destroy'])
        ->middleware('permission:city_admins.delete');

    /*
    |--------------------------------------------------------------------------
    | Categories
    |--------------------------------------------------------------------------
    */

    Route::post('/categories', [CategoryController::class, 'store'])
        ->middleware('permission:categories.create');

    Route::put('/categories/{category}', [CategoryController::class, 'update'])
        ->middleware('permission:categories.update');

    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])
        ->middleware('permission:categories.delete');

    /*
    |--------------------------------------------------------------------------
    | Contact Messages
    |--------------------------------------------------------------------------
    */

    Route::get('/contact-messages', [ContactMessageController::class, 'index'])
        ->middleware('permission:messages.view');

    Route::get('/contact-messages/{contactMessage}', [ContactMessageController::class, 'show'])
        ->middleware('permission:messages.view');

    Route::delete('/contact-messages/{contactMessage}', [ContactMessageController::class, 'destroy'])
        ->middleware('permission:messages.delete');

    /*
    |--------------------------------------------------------------------------
    | Feedback
    |--------------------------------------------------------------------------
    */

    Route::get('/feedback', [FeedbackController::class, 'index'])
        ->middleware('permission:feedback.view');

    Route::get('/feedback/{feedback}', [FeedbackController::class, 'show'])
        ->middleware('permission:feedback.view');

    Route::delete('/feedback/{feedback}', [FeedbackController::class, 'destroy'])
        ->middleware('permission:feedback.delete');

    /*
    |--------------------------------------------------------------------------
    | Notifications
    |--------------------------------------------------------------------------
    */

    Route::get('/notifications', [NotificationController::class, 'index'])
        ->middleware('permission:notifications.view');

    Route::post('/notifications', [NotificationController::class, 'store'])
        ->middleware('permission:notifications.create');

    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])
        ->middleware('permission:notifications.update');

    Route::get('/notifications/{notification}', [NotificationController::class, 'show'])
        ->middleware('permission:notifications.view');

    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])
        ->middleware('permission:notifications.update');

    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy'])
        ->middleware('permission:notifications.delete');

    /*
    |--------------------------------------------------------------------------
    | Role Assignment
    |--------------------------------------------------------------------------
    */


    /*
    |--------------------------------------------------------------------------
    | Admin Account Management
    |--------------------------------------------------------------------------
    */

    Route::get('/admin/accounts', [AdminAccountController::class, 'index'])
        ->middleware('permission:admin_accounts.view');

    Route::post('/admin/accounts', [AdminAccountController::class, 'store'])
        ->middleware('permission:admin_accounts.create');

    Route::put('/admin/accounts/{user}', [AdminAccountController::class, 'update'])
        ->middleware('permission:admin_accounts.update');

    Route::put('/admin/accounts/{user}/permissions', [AdminAccountController::class, 'permissions'])
        ->middleware('permission:admin_accounts.update');

    Route::delete('/admin/accounts/{user}', [AdminAccountController::class, 'destroy'])
        ->middleware('permission:admin_accounts.delete');
    Route::get('/admin/users', [AdminController::class, 'users']);

    Route::get('/admin/permissions', [PermissionController::class, 'index']);

    Route::get('/admin/roles', [AdminController::class, 'roles']);

    Route::put('/admin/users/{user}/role', [AdminController::class, 'assignRole']);

    Route::patch('/admin/users/{user}/status', [AdminController::class, 'status']);

    Route::delete('/admin/users/{user}', [AdminController::class, 'destroy']);
});


