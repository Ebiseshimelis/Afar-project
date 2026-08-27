<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BackgroundController extends Controller
{
    private const SECTIONS = ['default', 'home', 'about', 'directorates', 'newsEvents', 'cityAdmins', 'tenders', 'multimedia'];

    public function index()
    {
        return response()->json(['data' => $this->backgroundUrls($this->paths())]);
    }

    public function update(Request $request, string $section)
    {
        abort_unless(in_array($section, self::SECTIONS, true), 404);
        $request->validate([
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,gif', 'max:5120'],
            'image_url' => ['nullable', 'url', 'max:2048'],
        ]);
        if (!$request->hasFile('image') && !$request->filled('image_url')) {
            return response()->json(['message' => 'Please upload an image or provide an image URL.'], 422);
        }

        $paths = $this->paths();
        $previous = $paths[$section] ?? null;
        $paths[$section] = $request->hasFile('image')
            ? $request->file('image')->store('backgrounds', 'public')
            : $request->string('image_url')->toString();
        $this->savePaths($paths);
        $this->deleteLocalFile($previous);

        return response()->json(['message' => 'Background image saved successfully.', 'data' => $this->backgroundUrls($paths)]);
    }

    public function destroy(string $section)
    {
        abort_unless(in_array($section, self::SECTIONS, true), 404);
        $paths = $this->paths();
        $previous = $paths[$section] ?? null;
        unset($paths[$section]);
        $this->savePaths($paths);
        $this->deleteLocalFile($previous);

        return response()->json(['message' => 'Background image reset successfully.', 'data' => $this->backgroundUrls($paths)]);
    }

    private function paths(): array
    {
        $setting = SystemSetting::where('key', 'section_backgrounds')->first();
        $paths = json_decode($setting?->value ?? '{}', true);
        return is_array($paths) ? $paths : [];
    }

    private function savePaths(array $paths): void
    {
        SystemSetting::updateOrCreate(['key' => 'section_backgrounds'], ['value' => json_encode($paths), 'type' => 'json']);
    }

    private function backgroundUrls(array $paths): array
    {
        return collect($paths)->map(fn ($path) => filter_var($path, FILTER_VALIDATE_URL) ? $path : Storage::disk('public')->url($path))->all();
    }

    private function deleteLocalFile(?string $path): void
    {
        if ($path && !filter_var($path, FILTER_VALIDATE_URL) && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }
}
