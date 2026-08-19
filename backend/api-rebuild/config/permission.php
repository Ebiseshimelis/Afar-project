<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Normal Admin Permissions
    |--------------------------------------------------------------------------
    |
    | These permissions may be assigned to normal Admin accounts.
    | Every module uses the same four actions.
    |
    */

    'assignable_modules' => [
        'news',
        'events',
        'tenders',
        'vacancies',
        'publications',
        'multimedia',
        'announcements',
        'directorates',
        'city_admins',
        'categories',
        'messages',
        'feedback',
        'notifications',
        'media',
        'backgrounds',
    ],

    'actions' => [
        'view',
        'create',
        'update',
        'delete',
    ],

    /*
    |--------------------------------------------------------------------------
    | Super Admin Only
    |--------------------------------------------------------------------------
    */

    'super_admin_only_modules' => [
        'admin_accounts',
        'settings',
        'activity',
    ],

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    'all' => [
        'news.view',
        'news.create',
        'news.update',
        'news.delete',

        'events.view',
        'events.create',
        'events.update',
        'events.delete',

        'tenders.view',
        'tenders.create',
        'tenders.update',
        'tenders.delete',

        'vacancies.view',
        'vacancies.create',
        'vacancies.update',
        'vacancies.delete',

        'publications.view',
        'publications.create',
        'publications.update',
        'publications.delete',

        'multimedia.view',
        'multimedia.create',
        'multimedia.update',
        'multimedia.delete',

        'announcements.view',
        'announcements.create',
        'announcements.update',
        'announcements.delete',

        'directorates.view',
        'directorates.create',
        'directorates.update',
        'directorates.delete',

        'city_admins.view',
        'city_admins.create',
        'city_admins.update',
        'city_admins.delete',

        'categories.view',
        'categories.create',
        'categories.update',
        'categories.delete',

        'messages.view',
        'messages.create',
        'messages.update',
        'messages.delete',

        'feedback.view',
        'feedback.create',
        'feedback.update',
        'feedback.delete',

        'notifications.view',
        'notifications.create',
        'notifications.update',
        'notifications.delete',

        'media.view',
        'media.create',
        'media.update',
        'media.delete',

        'backgrounds.view',
        'backgrounds.create',
        'backgrounds.update',
        'backgrounds.delete',

        'admin_accounts.view',
        'admin_accounts.create',
        'admin_accounts.update',
        'admin_accounts.delete',

        'settings.view',
        'settings.create',
        'settings.update',
        'settings.delete',

        'activity.view',
        'activity.create',
        'activity.update',
        'activity.delete',
    ],

];