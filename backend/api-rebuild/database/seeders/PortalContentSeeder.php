<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\CityAdmin;
use App\Models\Event;
use App\Models\News;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/** Seeds the original portal samples as editable database content. */
class PortalContentSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@afarudcb.gov.et'],
            ['name' => 'Afar UDCB Admin', 'password' => Hash::make('ChangeMeBeforeProduction!')],
        );

        $newsCategory = Category::firstOrCreate(
            ['slug' => 'portal-news'],
            ['type' => 'general', 'name' => ['en' => 'News', 'am' => 'ዜና']],
        );
        $eventCategory = Category::firstOrCreate(
            ['slug' => 'portal-events'],
            ['type' => 'general', 'name' => ['en' => 'Events', 'am' => 'ዝግጅቶች']],
        );

        $newsItems = [
            ['Regional Urban Development Strategy 2026 launched in Semera', 'The Bureau unveils a five-year strategy focused on affordable housing, sustainable infrastructure, and inclusive city services.', 'The Afar Regional State Urban Development and Construction Bureau formally launched the Regional Urban Development Strategy 2026 in Semera. The strategy outlines targeted investments in affordable housing, water and sanitation, transport corridors, and municipal capacity building.', '2026-07-14', '/News1.jpg'],
            ['New professional licensing platform now serving contractors region-wide', 'Contractors can now apply, renew, and track professional licenses through a modernized digital service.', 'The digital licensing platform streamlines application, review, and issuance of professional construction licenses for contractors across the region.', '2026-07-08', '/News2.jpg'],
            ['Semera city administration hands over 240 condominium units', 'A milestone in the region’s affordable housing program with residents receiving keys to new homes.', 'Two hundred and forty condominium units were handed over to beneficiaries in Semera as part of the affordable housing initiative.', '2026-06-29', '/News3.jpg'],
            ['Cultural heritage program strengthens community engagement', 'Community-led programs celebrate Afar heritage while promoting sustainable tourism and local livelihoods.', 'Cultural heritage programs across the region are strengthening community engagement and creating economic opportunity through sustainable tourism.', '2026-06-18', '/News4.jpg'],
            ['Infrastructure investment reaches record levels this fiscal year', 'Roads, water systems, and municipal facilities see unprecedented investment across the region.', 'Regional infrastructure spending has reached record levels, with new roads, water systems, and municipal facilities under construction across all zones.', '2026-06-05', '/News5.jpg'],
            ['Training program equips 500 municipal officers with modern tools', 'Municipal officers across the region complete a comprehensive training program on digital governance.', 'Five hundred municipal officers completed a training program covering digital governance, procurement, and urban planning.', '2026-05-22', '/News6.jpg'],
        ];

        foreach ($newsItems as [$title, $summary, $content, $publishedAt, $imagePath]) {
            $payload = [
                    'category_id' => $newsCategory->id,
                    'created_by' => $admin->id,
                    'title' => ['en' => $title, 'am' => $title],
                    'content' => ['en' => $content, 'am' => $content],
                    'image_path' => $imagePath,
                    'status' => 'published',
                    'published_at' => $publishedAt,
                ];
            $record = News::where('title_en', $title)->first();
            $record ? $record->update($payload) : News::create($payload);
        }

        $events = [
            ['Regional Urban Forum 2026', '2026-09-12 09:00:00', 'Semera Convention Center', 'A three-day forum on sustainable urbanization, housing, and municipal finance.'],
            ['Contractor Registration Workshop', '2026-08-08 09:00:00', 'Bureau HQ, Semera', 'Guidance on the new digital contractor registration and licensing platform.'],
            ['Public consultation — Awash city master plan', '2026-08-20 09:00:00', 'Awash City Hall', 'Public review and consultation on the revised Awash city master plan.'],
        ];

        foreach ($events as [$title, $startAt, $location, $content]) {
            $payload = [
                    'category_id' => $eventCategory->id,
                    'created_by' => $admin->id,
                    'title' => ['en' => $title, 'am' => $title],
                    'content' => ['en' => $content, 'am' => $content],
                    'location' => $location,
                    'start_at' => $startAt,
                    'end_at' => $startAt,
                    'status' => 'published',
                    'published_at' => now(),
                ];
            $record = Event::where('title_en', $title)->first();
            $record ? $record->update($payload) : Event::create($payload);
        }

        $cities = [
            ['Semera City Administration', 'Mayor Ahmed Hassan', '033-666-1001', 'semera@afarudcb.gov.et', '/samara.jpg'],
            ['Abala City Administration', 'Mayor Ali Mohammed', '033-666-1002', 'Abala@afarudcb.gov.et', "/ab'ala.jpg"],
            ['Awash City Administration', 'Mayor Kedir Ibrahim', '033-666-1003', 'awash@afarudcb.gov.et', '/awash.jpg'],
            ['Dubti City Administration', 'Mayor Amina Yusuf', '033-666-1004', 'dubti@afarudcb.gov.et', '/dubti.jpg'],
            ['Asayita City Administration', 'Mayor Ibrahim Yusuf', '033-666-1005', 'asayita@afarudcb.gov.et', '/Asayita.jpg'],
        ];

        foreach ($cities as [$name, $mayor, $phone, $email, $imagePath]) {
            $payload = [
                    'name' => ['en' => $name, 'am' => $name],
                    'description' => ['en' => "$name delivers municipal services, urban planning, and infrastructure programs.", 'am' => $name],
                    'mayor_name' => $mayor,
                    'location' => 'Afar Regional State',
                    'email' => $email,
                    'phone' => $phone,
                    'image_path' => $imagePath,
                ];
            $record = CityAdmin::where('name_en', $name)->first();
            $record ? $record->update($payload) : CityAdmin::create($payload);
        }
    }
}
