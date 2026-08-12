<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CityAdminFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => [
                'en' => fake()->city() . ' City Administration',
                'am' => 'የከተማ አስተዳደር ' . fake()->numberBetween(1, 20),
            ],

            'description' => [
                'en' => fake()->paragraph(),
                'am' => 'ይህ የከተማ አስተዳደር መግለጫ ነው።',
            ],

            'mayor_name' => fake()->name(),

            'location' => 'Afar Region',

            'email' => fake()->safeEmail(),

            'phone' => fake()->phoneNumber(),

            'image_path' => null,
        ];
    }
}