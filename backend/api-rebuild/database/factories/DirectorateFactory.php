<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class DirectorateFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => [
                'en' => fake()->word() . ' Directorate',
                'am' => 'ዳይሬክቶሬት ' . fake()->numberBetween(1, 20),
            ],

            'description' => [
                'en' => fake()->paragraph(),
                'am' => 'የዳይሬክቶሬቱ መግለጫ ሙከራ ይዘት ነው።',
            ],

            'head_name' => [
                'en' => fake()->name(),
                'am' => 'የዳይሬክተር ስም',
            ],

            'head_title' => [
                'en' => 'Director',
                'am' => 'ዳይሬክተር',
            ],

            'email' => fake()->safeEmail(),

            'phone' => fake()->phoneNumber(),

            'photo_path' => null,

            'sort_order' => fake()->numberBetween(0, 10),
        ];
    }
}