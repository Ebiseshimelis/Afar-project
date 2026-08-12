<?php

namespace Database\Seeders;

use App\Models\Directorate;
use Illuminate\Database\Seeder;

class DirectorateSeeder extends Seeder
{
    public function run(): void
    {
        $directorates = [
            [
                'name' => [
                    'en' => 'Urban Land Development and Property Administration',
                    'am' => 'የከተማ መሬት ልማት እና ንብረት አስተዳደር',
                ],
                'description' => [
                    'en' => 'Urban Land Development and Property Administration Directorate.',
                    'am' => 'የከተማ መሬት ልማት እና ንብረት አስተዳደር ዳይሬክቶሬት።',
                ],
                'head_name' => [
                    'en' => 'Ato Mohammed Ahmed',
                    'am' => 'አቶ መሐመድ አህመድ',
                ],
                'head_title' => [
                    'en' => 'Director',
                    'am' => 'ዳይሬክተር',
                ],
                'email' => 'land@afarudcb.gov.et',
                'phone' => '033-666-0577',
                'photo_path' => 'directorates/land.jpg',
                'sort_order' => 1,
            ],

            [
                'name' => [
                    'en' => 'Procurement, Finance, and Property Administration',
                    'am' => 'ግዥ፣ ፋይናንስ እና ንብረት አስተዳደር',
                ],
                'description' => [
                    'en' => 'Procurement, Finance, and Property Administration Directorate.',
                    'am' => 'የግዥ፣ ፋይናንስ እና ንብረት አስተዳደር ዳይሬክቶሬት።',
                ],
                'head_name' => [
                    'en' => 'W/ro Fatuma Ali',
                    'am' => 'ወ/ሮ ፋጡማ አሊ',
                ],
                'head_title' => [
                    'en' => 'Director',
                    'am' => 'ዳይሬክተር',
                ],
                'email' => 'finance@afarudcb.gov.et',
                'phone' => '033-666-0578',
                'photo_path' => 'directorates/finance.jpg',
                'sort_order' => 2,
            ],

            [
                'name' => [
                    'en' => 'Human Resource Administration',
                    'am' => 'የሰው ሀብት አስተዳደር',
                ],
                'description' => [
                    'en' => 'Human Resource Administration Directorate.',
                    'am' => 'የሰው ሀብት አስተዳደር ዳይሬክቶሬት።',
                ],
                'head_name' => [
                    'en' => 'Ato Ibrahim Yusuf',
                    'am' => 'አቶ ኢብራሂም ዩሱፍ',
                ],
                'head_title' => [
                    'en' => 'Director',
                    'am' => 'ዳይሬክተር',
                ],
                'email' => 'hr@afarudcb.gov.et',
                'phone' => '033-666-0579',
                'photo_path' => 'directorates/Hrd.jpg',
                'sort_order' => 3,
            ],

            [
                'name' => [
                    'en' => 'Construction, Planning, and Budget Preparation',
                    'am' => 'ግንባታ፣ እቅድ እና በጀት ዝግጅት',
                ],
                'description' => [
                    'en' => 'Construction, Planning, and Budget Preparation Directorate.',
                    'am' => 'የግንባታ፣ እቅድ እና በጀት ዝግጅት ዳይሬክቶሬት።',
                ],
                'head_name' => [
                    'en' => 'Ato Hassan Osman',
                    'am' => 'አቶ ሀሰን ኦስማን',
                ],
                'head_title' => [
                    'en' => 'Director',
                    'am' => 'ዳይሬክተር',
                ],
                'email' => 'construction@afarudcb.gov.et',
                'phone' => '033-666-0580',
                'photo_path' => 'directorates/construction.jpg',
                'sort_order' => 4,
            ],

            [
                'name' => [
                    'en' => 'Urban Sanitation Beautification and Greenery Development',
                    'am' => 'የከተማ ንፅህና ውበት እና አረንጓዴ ልማት',
                ],
                'description' => [
                    'en' => 'Urban Sanitation, Beautification and Greenery Development Directorate.',
                    'am' => 'የከተማ ንፅህና፣ ውበት እና አረንጓዴ ልማት ዳይሬክቶሬት።',
                ],
                'head_name' => [
                    'en' => 'W/ro Amina Yusuf',
                    'am' => 'ወ/ሮ አሚና ዩሱፍ',
                ],
                'head_title' => [
                    'en' => 'Director',
                    'am' => 'ዳይሬክተር',
                ],
                'email' => 'sanitation@afarudcb.gov.et',
                'phone' => '033-666-0581',
                'photo_path' => 'directorates/sanitation.jpg',
                'sort_order' => 5,
            ],

            [
                'name' => [
                    'en' => 'Urban Good Governance and Capacity Building',
                    'am' => 'የከተማ መልካም አስተዳደር እና አቅም ግንባታ',
                ],
                'description' => [
                    'en' => 'Urban Good Governance and Capacity Building Directorate.',
                    'am' => 'የከተማ መልካም አስተዳደር እና አቅም ግንባታ ዳይሬክቶሬት።',
                ],
                'head_name' => [
                    'en' => 'Ato Yusuf Mohammed',
                    'am' => 'አቶ ዩሱፍ መሐመድ',
                ],
                'head_title' => [
                    'en' => 'Director',
                    'am' => 'ዳይሬክተር',
                ],
                'email' => 'governance@afarudcb.gov.et',
                'phone' => '033-666-0582',
                'photo_path' => 'directorates/governance.jpg',
                'sort_order' => 6,
            ],

            [
                'name' => [
                    'en' => 'Plan and Budget Preparation',
                    'am' => 'እቅድ እና በጀት ዝግጅት',
                ],
                'description' => [
                    'en' => 'Plan and Budget Preparation Directorate.',
                    'am' => 'የእቅድ እና በጀት ዝግጅት ዳይሬክቶሬት።',
                ],
                'head_name' => [
                    'en' => 'Ato Kedir Ibrahim',
                    'am' => 'አቶ ከድር ኢብራሂም',
                ],
                'head_title' => [
                    'en' => 'Director',
                    'am' => 'ዳይሬክተር',
                ],
                'email' => 'plan@afarudcb.gov.et',
                'phone' => '033-666-0583',
                'photo_path' => 'directorates/planning.jpg',
                'sort_order' => 7,
            ],

            [
                'name' => [
                    'en' => 'Internal Audit',
                    'am' => 'የውስጥ ኦዲት',
                ],
                'description' => [
                    'en' => 'Internal Audit Directorate.',
                    'am' => 'የውስጥ ኦዲት ዳይሬክቶሬት።',
                ],
                'head_name' => [
                    'en' => 'W/ro Zeineba Ali',
                    'am' => 'ወ/ሮ ዘይነባ አሊ',
                ],
                'head_title' => [
                    'en' => 'Director',
                    'am' => 'ዳይሬክተር',
                ],
                'email' => 'audit@afarudcb.gov.et',
                'phone' => '033-666-0584',
                'photo_path' => 'directorates/audit.jpg',
                'sort_order' => 8,
            ],

            [
                'name' => [
                    'en' => 'Communication Affairs',
                    'am' => 'የኮሙኒኬሽን ጉዳዮች',
                ],
                'description' => [
                    'en' => 'Communication Affairs Directorate.',
                    'am' => 'የኮሙኒኬሽን ጉዳዮች ዳይሬክቶሬት።',
                ],
                'head_name' => [
                    'en' => 'Ato Abdu Mohammed',
                    'am' => 'አቶ አብዱ መሐመድ',
                ],
                'head_title' => [
                    'en' => 'Director',
                    'am' => 'ዳይሬክተር',
                ],
                'email' => 'communication@afarudcb.gov.et',
                'phone' => '033-666-0585',
                'photo_path' => 'directorates/communication.jpg',
                'sort_order' => 9,
            ],

            [
                'name' => [
                    'en' => 'ICT',
                    'am' => 'የመረጃ ቴክኖሎጂ',
                ],
                'description' => [
                    'en' => 'Information and Communication Technology Directorate.',
                    'am' => 'የመረጃ እና መገናኛ ቴክኖሎጂ ዳይሬክቶሬት።',
                ],
                'head_name' => [
                    'en' => 'Ato Nuru Hassan',
                    'am' => 'አቶ ኑሩ ሀሰን',
                ],
                'head_title' => [
                    'en' => 'Director',
                    'am' => 'ዳይሬክተር',
                ],
                'email' => 'ict@afarudcb.gov.et',
                'phone' => '033-666-0586',
                'photo_path' => 'directorates/ict.jpg',
                'sort_order' => 10,
            ],
        ];

        foreach ($directorates as $directorate) {
            Directorate::create($directorate);
        }
    }
}