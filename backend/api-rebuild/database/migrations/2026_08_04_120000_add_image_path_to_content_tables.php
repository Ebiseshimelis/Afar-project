<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('news', function (Blueprint $table) {
            if (!Schema::hasColumn('news', 'image_path')) {
                $table->string('image_path')->nullable()->after('content');
            }
        });

        Schema::table('events', function (Blueprint $table) {
            if (!Schema::hasColumn('events', 'image_path')) {
                $table->string('image_path')->nullable()->after('content');
            }
        });

        Schema::table('directorates', function (Blueprint $table) {
            if (!Schema::hasColumn('directorates', 'photo_path')) {
                $table->string('photo_path')->nullable();
            }

            if (!Schema::hasColumn('directorates', 'image_path')) {
                $table->string('image_path')->nullable()->after('photo_path');
            }
        });
    }

    public function down(): void
    {
        Schema::table('news', function (Blueprint $table) {
            if (Schema::hasColumn('news', 'image_path')) {
                $table->dropColumn('image_path');
            }
        });

        Schema::table('events', function (Blueprint $table) {
            if (Schema::hasColumn('events', 'image_path')) {
                $table->dropColumn('image_path');
            }
        });

        Schema::table('directorates', function (Blueprint $table) {
            if (Schema::hasColumn('directorates', 'image_path')) {
                $table->dropColumn('image_path');
            }
        });
    }
};
