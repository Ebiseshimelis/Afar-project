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
        Schema::create('news', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->restrictOnDelete();
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->json('title'); // {"en": "...", "am": "..."}
            $table->json('content'); // {"en": "...", "am": "..."}
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Extracted virtual columns for MySQL FULLTEXT indexing on JSON
            $table->string('title_en')->virtualAs("JSON_UNQUOTE(JSON_EXTRACT(title, '$.en'))");
            $table->string('title_am')->virtualAs("JSON_UNQUOTE(JSON_EXTRACT(title, '$.am'))");

            // Indexes
            $table->index(['status', 'published_at', 'deleted_at']);
            $table->index(['title_en', 'title_am']);
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('news');
    }
};
