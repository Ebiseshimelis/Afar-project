<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('publications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->restrictOnDelete();
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->json('title');
            $table->json('description')->nullable();
            $table->string('file_path');
            $table->string('file_type', 50)->default('pdf');
            $table->unsignedBigInteger('file_size')->default(0);
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->string('title_en')->nullable()->storedAs("JSON_UNQUOTE(JSON_EXTRACT(title, '$.en'))");
            $table->string('title_am')->nullable()->storedAs("JSON_UNQUOTE(JSON_EXTRACT(title, '$.am'))");

            $table->index(['status', 'deleted_at']);
            $table->fullText(['title_en', 'title_am']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('publications');
    }
};