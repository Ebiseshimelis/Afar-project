<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Directorate;
use App\Models\CityAdmin;
use App\Models\Category;
use App\Models\News;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test user (needed for news created_by)
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Create categories (needed for news)
        Category::factory(5)->create();

        // Create news
        News::factory(10)->create([
            'created_by' => $user->id,
        ]);

        // Create city administrations
        CityAdmin::factory(5)->create();

        // Create real directorates
        $this->call(DirectorateSeeder::class);
    }
}