<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->json('title');
            $table->json('content');
            $table->boolean('is_urgent')->default(false);
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->timestamps();
            $table->softDeletes();

            $table->string('title_en')->nullable()->storedAs("JSON_UNQUOTE(JSON_EXTRACT(title, '$.en'))");
            $table->string('title_am')->nullable()->storedAs("JSON_UNQUOTE(JSON_EXTRACT(title, '$.am'))");

            $table->index(['is_urgent', 'status', 'expires_at']);
            $table->fullText(['title_en', 'title_am']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};