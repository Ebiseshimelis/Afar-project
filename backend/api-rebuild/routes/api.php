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

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

require __DIR__.'/auth.php';

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // Auth
    Route::post('/login', [AuthController::class, 'login']);

    // About
    Route::get('/about', [AboutController::class, 'index']);

    // News
    Route::get('/news', [NewsController::class, 'index']);
    Route::get('/news/{news}', [NewsController::class, 'show']);

    // Health check
    Route::get('/ping', function () {
        return response()->json([
            'status' => 'ok'
        ], 200);
    })->name('api.ping');

    // Events
    Route::get('/events', [EventController::class, 'index']);
    Route::get('/events/{event}', [EventController::class, 'show']);

    // Tenders
    Route::get('/tenders', [TenderController::class, 'index']);
    Route::get('/tenders/{tender}', [TenderController::class, 'show']);

    // Vacancies
    Route::get('/vacancies', [VacancyController::class, 'index']);
    Route::get('/vacancies/{vacancy}', [VacancyController::class, 'show']);

    // Publications
    Route::get('/publications', [PublicationController::class, 'index']);
    Route::get('/publications/{publication}', [PublicationController::class, 'show']);

    // Multimedia
    Route::get('/multimedia', [MultimediaController::class, 'index']);
    Route::get('/multimedia/{multimedia}', [MultimediaController::class, 'show']);

    // Announcements
    Route::get('/announcements', [AnnouncementController::class, 'index']);
    Route::get('/announcements/{announcement}', [AnnouncementController::class, 'show']);

    // Directorates
    Route::get('/directorates', [DirectorateController::class, 'index']);
    Route::get('/directorates/{directorate}', [DirectorateController::class, 'show']);

    // City Administrations
    Route::get('/city-admins', [CityAdminController::class, 'index']);
    Route::get('/city-admins/{cityAdmin}', [CityAdminController::class, 'show']);

    // Categories
    Route::get('/categories', [CategoryController::class, 'index']);

    // Contact Form
    Route::post('/contact', [ContactMessageController::class, 'store']);

    // Public Feedback
    Route::post('/feedback', [FeedbackController::class, 'store']);
});

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->middleware('auth:sanctum')->group(function () {

    // Current authenticated user
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // News
    Route::post('/news', [NewsController::class, 'store']);
    Route::put('/news/{news}', [NewsController::class, 'update']);
    Route::delete('/news/{news}', [NewsController::class, 'destroy']);

    // Events
    Route::post('/events', [EventController::class, 'store']);
    Route::put('/events/{event}', [EventController::class, 'update']);
    Route::delete('/events/{event}', [EventController::class, 'destroy']);

    // Tenders
    Route::post('/tenders', [TenderController::class, 'store']);
    Route::put('/tenders/{tender}', [TenderController::class, 'update']);
    Route::delete('/tenders/{tender}', [TenderController::class, 'destroy']);

    // Vacancies
    Route::post('/vacancies', [VacancyController::class, 'store']);
    Route::put('/vacancies/{vacancy}', [VacancyController::class, 'update']);
    Route::delete('/vacancies/{vacancy}', [VacancyController::class, 'destroy']);

    // Publications
    Route::post('/publications', [PublicationController::class, 'store']);
    Route::put('/publications/{publication}', [PublicationController::class, 'update']);
    Route::delete('/publications/{publication}', [PublicationController::class, 'destroy']);

    // Multimedia
    Route::post('/multimedia', [MultimediaController::class, 'store']);
    Route::put('/multimedia/{multimedia}', [MultimediaController::class, 'update']);
    Route::delete('/multimedia/{multimedia}', [MultimediaController::class, 'destroy']);

    // Announcements
    Route::post('/announcements', [AnnouncementController::class, 'store']);
    Route::put('/announcements/{announcement}', [AnnouncementController::class, 'update']);
    Route::delete('/announcements/{announcement}', [AnnouncementController::class, 'destroy']);

    // Directorates
    Route::post('/directorates', [DirectorateController::class, 'store']);
    Route::put('/directorates/{directorate}', [DirectorateController::class, 'update']);
    Route::delete('/directorates/{directorate}', [DirectorateController::class, 'destroy']);

    // City Administrations
    Route::post('/city-admins', [CityAdminController::class, 'store']);
    Route::put('/city-admins/{cityAdmin}', [CityAdminController::class, 'update']);
    Route::delete('/city-admins/{cityAdmin}', [CityAdminController::class, 'destroy']);

    // Categories
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

    // Contact Messages
    Route::get('/contact-messages', [ContactMessageController::class, 'index']);
    Route::get('/contact-messages/{contactMessage}', [ContactMessageController::class, 'show']);
    Route::delete('/contact-messages/{contactMessage}', [ContactMessageController::class, 'destroy']);

    // Feedback
    Route::get('/feedback', [FeedbackController::class, 'index']);
    Route::get('/feedback/{feedback}', [FeedbackController::class, 'show']);
    Route::delete('/feedback/{feedback}', [FeedbackController::class, 'destroy']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications', [NotificationController::class, 'store']);

    // IMPORTANT: read-all must come before {notification}
    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);

    Route::get('/notifications/{notification}', [NotificationController::class, 'show']);
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy']);

    // Admin role management
    Route::post('/admin/assign-role', [AdminController::class, 'assignRole']);
});
