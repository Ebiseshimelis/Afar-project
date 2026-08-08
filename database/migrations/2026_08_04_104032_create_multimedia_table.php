<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('multimedia', function (Blueprint $table) {
            $table->id();

            $table->string('title');
            $table->text('description')->nullable();

            // image or video
            $table->enum('type', ['image', 'video']);

            // Uploaded file
            $table->string('file_path')->nullable();

            // For YouTube or external videos
            $table->string('video_url')->nullable();

            // Thumbnail (optional)
            $table->string('thumbnail')->nullable();

            // Status
            $table->enum('status', ['draft', 'published'])->default('published');

            // User who uploaded
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamps();

            $table->index(['type', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('multimedia');
    }
};