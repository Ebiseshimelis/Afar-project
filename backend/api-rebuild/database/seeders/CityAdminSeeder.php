<?php

namespace Database\Seeders;

use App\Models\CityAdmin;
use Illuminate\Database\Seeder;

class CityAdminSeeder extends Seeder
{
    public function run(): void
    {
        CityAdmin::withTrashed()->forceDelete();

        $cityAdmins = [
            [
                'name' => [
                    'en' => 'Semera City Administration',
                    'am' => 'የሰመራ ከተማ አስተዳደር',
                ],
                'description' => [
                    'en' => 'Semera City Administration provides municipal services and supports urban development and infrastructure programs in the city.',
                    'am' => 'የሰመራ ከተማ አስተዳደር የማዘጋጃ ቤት አገልግሎቶችን ይሰጣል።',
                ],
                'mayor_name' => 'Mayor Ahmed Hassan',
                'location' => 'Semera, Afar',
                'email' => 'semera@afarudcb.gov.et',
                'phone' => '033-666-1001',
                'image_path' => '/samara.jpg',
            ],
            [
                'name' => [
                    'en' => "Ab'ala City Administration",
                    'am' => 'የአብዓላ ከተማ አስተዳደር',
                ],
                'description' => [
                    'en' => "Ab'ala City Administration provides municipal services and supports urban development programs in the city.",
                    'am' => 'የአብዓላ ከተማ አስተዳደር የማዘጋጃ ቤት አገልግሎቶችን ይሰጣል።',
                ],
                'mayor_name' => 'Mayor Ali Mohammed',
                'location' => "Ab'ala, Afar",
                'email' => 'abala@afarudcb.gov.et',
                'phone' => '033-666-1002',
                'image_path' => "/ab'ala.jpg",
            ],
            [
                'name' => [
                    'en' => 'Awash City Administration',
                    'am' => 'የአዋሽ ከተማ አስተዳደር',
                ],
                'description' => [
                    'en' => 'Awash City Administration provides municipal services and supports urban planning, infrastructure, and development programs.',
                    'am' => 'የአዋሽ ከተማ አስተዳደር የማዘጋጃ ቤት አገልግሎቶችን እና የከተማ ልማት ስራዎችን ይደግፋል።',
                ],
                'mayor_name' => 'Mayor Kedir Ibrahim',
                'location' => 'Awash, Afar',
                'email' => 'awash@afarudcb.gov.et',
                'phone' => '033-666-1003',
                'image_path' => '/awash.jpg',
            ],
            [
                'name' => [
                    'en' => 'Dubti City Administration',
                    'am' => 'የዱብቲ ከተማ አስተዳደር',
                ],
                'description' => [
                    'en' => 'Dubti City Administration provides municipal services and coordinates urban development activities in the city.',
                    'am' => 'የዱብቲ ከተማ አስተዳደር የማዘጋጃ ቤት አገልግሎቶችን ይሰጣል።',
                ],
                'mayor_name' => 'Mayor Amina Yusuf',
                'location' => 'Dubti, Afar',
                'email' => 'dubti@afarudcb.gov.et',
                'phone' => '033-666-1004',
                'image_path' => '/dubti.jpg',
            ],
            [
                'name' => [
                    'en' => 'Asayita City Administration',
                    'am' => 'የአሳይታ ከተማ አስተዳደር',
                ],
                'description' => [
                    'en' => 'Asayita City Administration provides municipal services and supports urban development and infrastructure programs in the city.',
                    'am' => 'የአሳይታ ከተማ አስተዳደር የማዘጋጃ ቤት አገልግሎቶችን ይሰጣል።',
                ],
                'mayor_name' => 'Mayor Ibrahim Yusuf',
                'location' => 'Asayita, Afar',
                'email' => 'asayita@afarudcb.gov.et',
                'phone' => '033-666-1005',
                'image_path' => '/Asayita.jpg',
            ],
        ];

        foreach ($cityAdmins as $cityAdmin) {
            CityAdmin::create($cityAdmin);
        }
    }
}