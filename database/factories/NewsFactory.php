<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class NewsFactory extends Factory
{
    public function definition(): array
    {
        return [
            'category_id' => Category::factory(),
            'created_by' => User::factory(),

            'title' => [
                'en' => fake()->sentence(),
                'am' => 'የዜና ርዕስ ' . fake()->numberBetween(1, 100),
            ],

            'content' => [
                'en' => fake()->paragraphs(3, true),
                'am' => 'ይህ የአፋር ክልል የሙከራ ዜና ይዘት ነው።',
            ],

            'status' => fake()->randomElement([
                'draft',
                'published'
            ]),

            'published_at' => now(),
        ];
    }
}