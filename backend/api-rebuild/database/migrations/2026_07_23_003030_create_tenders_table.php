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
        Schema::create('tenders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->restrictOnDelete();
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->json('title');
            $table->json('content');
            $table->string('file_path');
            $table->timestamp('opens_at')->nullable();
            $table->timestamp('closes_at')->nullable();
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // STORED generated columns allow MySQL to maintain FULLTEXT indexes on disk
            $table->string('title_en')->nullable()->storedAs("JSON_UNQUOTE(JSON_EXTRACT(title, '$.en'))");
            $table->string('title_am')->nullable()->storedAs("JSON_UNQUOTE(JSON_EXTRACT(title, '$.am'))");

            $table->index(['opens_at', 'closes_at', 'status', 'deleted_at']);
            $table->fullText(['title_en', 'title_am']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tenders');
    }
};
