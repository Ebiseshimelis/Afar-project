<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\RolePermission;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Seed the default staff roles and their permissions.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Content & Communications Officer',
                'description' => 'Manages news, events, announcements, multimedia, and publications.',
                'permissions' => [
                    'news.view',
                    'news.create',
                    'news.update',
                    'news.delete',
                    'events.view',
                    'events.create',
                    'events.update',
                    'events.delete',
                    'announcements.view',
                    'announcements.create',
                    'announcements.update',
                    'announcements.delete',
                    'multimedia.view',
                    'multimedia.create',
                    'multimedia.update',
                    'multimedia.delete',
                    'publications.view',
                    'publications.create',
                    'publications.update',
                    'publications.delete',
                ],
            ],
            [
                'name' => 'Procurement & Contracts Officer',
                'description' => 'Manages tenders, procurement-related content, and supporting publications and events.',
                'permissions' => [
                    'tenders.view',
                    'tenders.create',
                    'tenders.update',
                    'tenders.delete',
                    'publications.view',
                    'publications.create',
                    'publications.update',
                    'publications.delete',
                    'events.view',
                    'events.create',
                    'events.update',
                    'events.delete',
                ],
            ],
            [
                'name' => 'Human Resources Officer',
                'description' => 'Manages vacancies and job applications.',
                'permissions' => [
                    'vacancies.view',
                    'vacancies.create',
                    'vacancies.update',
                    'vacancies.delete',
                ],
            ],
            [
                'name' => 'Directorate & City Administration Officer',
                'description' => 'Manages directorates and city administration information.',
                'permissions' => [
                    'directorates.view',
                    'directorates.create',
                    'directorates.update',
                    'directorates.delete',
                    'city_admins.view',
                    'city_admins.create',
                    'city_admins.update',
                    'city_admins.delete',
                ],
            ],
            [
                'name' => 'Digital Services Officer',
                'description' => 'Manages digital portal content, multimedia, portfolios, and backgrounds.',
                'permissions' => [
                    'news.view',
                    'news.create',
                    'news.update',
                    'news.delete',
                    'multimedia.view',
                    'multimedia.create',
                    'multimedia.update',
                    'multimedia.delete',
                    'portfolios.view',
                    'portfolios.create',
                    'portfolios.update',
                    'portfolios.delete',
                    'backgrounds.view',
                    'backgrounds.create',
                    'backgrounds.update',
                    'backgrounds.delete',
                ],
            ],
            [
                'name' => 'Content Manager',
                'description' => 'Broad content management role covering the main public portal content modules.',
                'permissions' => [
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
                    'portfolios.view',
                    'portfolios.create',
                    'portfolios.update',
                    'portfolios.delete',
                    'multimedia.view',
                    'multimedia.create',
                    'multimedia.update',
                    'multimedia.delete',
                    'announcements.view',
                    'announcements.create',
                    'announcements.update',
                    'announcements.delete',
                ],
            ],
        ];

        foreach ($roles as $roleData) {
            $permissions = $roleData['permissions'];

            $role = Role::updateOrCreate(
                ['name' => $roleData['name']],
                [
                    'description' => $roleData['description'],
                ]
            );

            $role->rolePermissions()->delete();

            foreach ($permissions as $permission) {
                RolePermission::create([
                    'role_id' => $role->id,
                    'permission' => $permission,
                ]);
            }
        }
    }
}

