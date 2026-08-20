<?php

namespace Database\Seeders;

use App\Models\SystemSetting;
use Illuminate\Database\Seeder;

class SystemSettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            [
                'key' => 'organization_name',
                'value' => 'Afar UDCB',
                'type' => 'string',
            ],
            [
                'key' => 'contact_email',
                'value' => 'info@afarudcb.gov.et',
                'type' => 'string',
            ],
            [
                'key' => 'phone',
                'value' => '033-666-0577',
                'type' => 'string',
            ],
            [
                'key' => 'timezone',
                'value' => 'Africa/Addis_Ababa',
                'type' => 'string',
            ],
            [
                'key' => 'default_language',
                'value' => 'English',
                'type' => 'string',
            ],
            [
                'key' => 'fiscal_year_start',
                'value' => 'July 8',
                'type' => 'string',
            ],

            [
                'key' => 'portal_tagline',
                'value' => 'Urban Development & Construction Bureau',
                'type' => 'string',
            ],
            [
                'key' => 'about_summary',
                'value' => 'Modernizing urban development and construction services across the Afar Regional State.',
                'type' => 'text',
            ],
            [
                'key' => 'facebook_url',
                'value' => 'https://facebook.com/afarudcb',
                'type' => 'string',
            ],
            [
                'key' => 'twitter_url',
                'value' => 'https://twitter.com/afarudcb',
                'type' => 'string',
            ],

            [
                'key' => 'hero_headline',
                'value' => 'Modernizing urban development for the Afar Region',
                'type' => 'string',
            ],
            [
                'key' => 'hero_subheadline',
                'value' => 'Serving cities, contractors, and citizens with transparent digital services.',
                'type' => 'text',
            ],

            [
                'key' => 'show_news',
                'value' => '1',
                'type' => 'boolean',
            ],
            [
                'key' => 'show_tenders',
                'value' => '1',
                'type' => 'boolean',
            ],
            [
                'key' => 'show_events',
                'value' => '1',
                'type' => 'boolean',
            ],

            /*
             * Controls whether new Admin account registrations
             * are allowed.
             *
             * 1 = registration enabled
             * 0 = registration disabled
             */
            [
                'key' => 'allow_admin_registration',
                'value' => '1',
                'type' => 'boolean',
            ],

            [
                'key' => 'navigation_items',
                'value' => json_encode([
                    ['label' => 'Home', 'visible' => true, 'order' => 1],
                    ['label' => 'About', 'visible' => true, 'order' => 2],
                    ['label' => 'Directorate', 'visible' => true, 'order' => 3],
                    ['label' => 'City Admins', 'visible' => true, 'order' => 4],
                    ['label' => 'News', 'visible' => true, 'order' => 5],
                    ['label' => 'Events', 'visible' => true, 'order' => 6],
                    ['label' => 'Tenders', 'visible' => true, 'order' => 7],
                    ['label' => 'Vacancies', 'visible' => true, 'order' => 8],
                    ['label' => 'Publications', 'visible' => true, 'order' => 9],
                    ['label' => 'Contact', 'visible' => true, 'order' => 10],
                ], JSON_THROW_ON_ERROR),
                'type' => 'json',
            ],

            [
                'key' => 'primary_color',
                'value' => 'Navy',
                'type' => 'string',
            ],
            [
                'key' => 'corner_radius',
                'value' => 'Rounded (default)',
                'type' => 'string',
            ],
            [
                'key' => 'density',
                'value' => 'Comfortable',
                'type' => 'string',
            ],
        ];

        foreach ($settings as $setting) {
            SystemSetting::updateOrCreate(
                ['key' => $setting['key']],
                [
                    'value' => $setting['value'],
                    'type' => $setting['type'],
                ]
            );
        }
    }
}