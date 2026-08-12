<?php

namespace Database\Seeders;

use App\Models\About;
use Illuminate\Database\Seeder;

class AboutSeeder extends Seeder
{
    public function run(): void
    {
        About::create([
            'mission' => 'Deliver inclusive, efficient, and sustainable urban development services that improve quality of life across every city and town in the Afar Regional State.',

            'vision' => 'A region of modern, well-planned cities where every citizen has access to safe housing, quality infrastructure, and reliable municipal services.',

            'values' => 'Integrity, service excellence, transparency, accountability, and respect for the cultural heritage of the Afar people.',

            'description' => "The Bureau oversees urban planning, housing development, land management, municipal support, and construction industry regulation across the Afar Regional State. We work with seven city administrations and dozens of towns to plan, build, and maintain the region's urban systems.",

            'services' => [
                'Urban planning & land information systems',
                'Municipal capacity building & public services',
                'Construction industry regulation & licensing',
            ],

            'image' => null,
        ]);
    }
}