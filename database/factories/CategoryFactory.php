<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Category>
 */
class CategoryFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->word();

        return [
            'name' => [
                'en' => $name,
                'am' => 'ምድብ ' . fake()->numberBetween(1, 20),
            ],

            'slug' => strtolower($name) . '-' . fake()->unique()->numberBetween(1, 10000),
        ];
    }
}