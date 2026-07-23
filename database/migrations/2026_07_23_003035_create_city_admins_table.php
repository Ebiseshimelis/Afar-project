<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('city_administrations', function (Blueprint $table) {
            $table->id();
            $table->json('name');
            $table->json('description')->nullable();
            $table->string('mayor_name')->nullable();
            $table->string('location')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('image_path')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->string('name_en')->nullable()->storedAs("JSON_UNQUOTE(JSON_EXTRACT(name, '$.en'))");
            $table->string('name_am')->nullable()->storedAs("JSON_UNQUOTE(JSON_EXTRACT(name, '$.am'))");

            $table->fullText(['name_en', 'name_am']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('city_administrations');
    }
};