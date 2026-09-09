<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\Request;

class SystemSettingController extends Controller
{
    public function index()
    {
        $settings = SystemSetting::orderBy('key')
            ->get()
            ->mapWithKeys(function ($setting) {
                return [
                    $setting->key => $this->castValue(
                        $setting->value,
                        $setting->type
                    ),
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => $settings,
        ]);
    }

    public function public()
    {
        $publicKeys = [
            'organization_name',
            'contact_email',
            'phone',
            'portal_tagline',
            'about_summary',
            'facebook_url',
            'twitter_url',
            'hero_headline',
            'hero_subheadline',
            'show_news',
            'show_tenders',
            'show_events',
        ];

        $settings = SystemSetting::whereIn('key', $publicKeys)
            ->orderBy('key')
            ->get()
            ->mapWithKeys(function ($setting) {
                return [
                    $setting->key => $this->castValue(
                        $setting->value,
                        $setting->type
                    ),
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => $settings,
        ]);
    }
    public function update(Request $request)
    {
        $settings = $request->input('settings', []);

        if (!is_array($settings)) {
            return response()->json([
                'status' => 'error',
                'message' => 'The settings field must be an object.',
            ], 422);
        }

        foreach ($settings as $key => $value) {
            $setting = SystemSetting::where('key', $key)->first();

            if (!$setting) {
                continue;
            }

            $storedValue = match ($setting->type) {
                'boolean' => $value ? '1' : '0',
                'json' => json_encode($value, JSON_THROW_ON_ERROR),
                default => (string) $value,
            };

            $setting->update([
                'value' => $storedValue,
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Settings updated successfully.',
        ]);
    }

    private function castValue(?string $value, string $type)
    {
        return match ($type) {
            'boolean' => $value === '1',
            'json' => json_decode($value ?? 'null', true),
            default => $value,
        };
    }
}

