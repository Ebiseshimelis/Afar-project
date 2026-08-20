<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add account approval status to users.
     *
     * pending  = Admin registered but is waiting for Super Admin approval.
     * approved = Account has been approved and may log in.
     * rejected = Registration was rejected by Super Admin.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('account_status')
                ->default('approved')
                ->after('is_active');
        });
    }

    /**
     * Remove account approval status.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('account_status');
        });
    }
};
