<?php

namespace Database\Seeders;

use App\Models\Portfolio;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class PortfolioSeeder extends Seeder
{
    public function run(): void
    {
        /*
         * These captions are the original static homepage Portfolio values.
         * The old UI had no separate title or body, so each caption is kept
         * exactly as both title and content rather than inventing new copy.
         */
        $items = [
            ['title' => 'Urban development project', 'content' => 'Urban development project', 'image' => 'portfolio1.png', 'order' => 1],
            ['title' => 'Construction milestone', 'content' => 'Construction milestone', 'image' => 'portfolio2.png', 'order' => 2],
            ['title' => 'City infrastructure', 'content' => 'City infrastructure', 'image' => 'portfolio3.png', 'order' => 3],
            ['title' => 'Housing delivery', 'content' => 'Housing delivery', 'image' => 'portfolio4.png', 'order' => 4],
        ];

        foreach ($items as $item) {
            $storagePath = 'portfolios/' . $item['image'];
            $sourcePath = dirname(base_path(), 2) . '/UI2/public/' . $item['image'];

            if (!Storage::disk('public')->exists($storagePath)) {
                if (!File::exists($sourcePath)) {
                    throw new RuntimeException("Portfolio source image is missing: {$sourcePath}");
                }

                Storage::disk('public')->put($storagePath, File::get($sourcePath));
            }

            Portfolio::updateOrCreate(
                ['order' => $item['order']],
                [
                    'title' => $item['title'],
                    'content' => $item['content'],
                    'image' => $storagePath,
                ]
            );
        }
    }
}
