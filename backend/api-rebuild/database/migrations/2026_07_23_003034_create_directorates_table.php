<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('directorates', function (Blueprint $table) {
            $table->id();

            $table->json('name');
            $table->json('description')->nullable();

            $table->json('head_name')->nullable();
            $table->json('head_title')->nullable();

            $table->string('email')->nullable();
            $table->string('phone')->nullable();

            $table->string('photo_path')->nullable();

            $table->integer('sort_order')->default(0);

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('directorates');
    }
};