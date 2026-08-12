<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create Admin User
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name'     => 'System Admin',
                'password' => Hash::make('password123'),
            ]
        );

        // 2. Create Default Categories
        DB::table('categories')->insertOrIgnore([
            [
                'name'       => json_encode(['en' => 'General News', 'am' => 'መደበኛ ዜና']),
                'slug'       => 'general-news',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name'       => json_encode(['en' => 'Press Release', 'am' => 'መግለጫ']),
                'slug'       => 'press-release',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name'       => json_encode(['en' => 'Procurement & Tenders', 'am' => 'ጨረታዎች']),
                'slug'       => 'procurement-tenders',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name'       => json_encode(['en' => 'Job Vacancies', 'am' => 'የሥራ ማስታወቂያዎች']),
                'slug'       => 'job-vacancies',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}