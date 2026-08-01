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
        Schema::table('assets', function (Blueprint $table) {
            $table->index('acquisition_date');
        });

        Schema::table('finance_records', function (Blueprint $table) {
            $table->index(['date', 'type']);
        });

        Schema::table('certificates', function (Blueprint $table) {
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('assets', function (Blueprint $table) {
            $table->dropIndex(['acquisition_date']);
        });

        Schema::table('finance_records', function (Blueprint $table) {
            $table->dropIndex(['date', 'type']);
        });

        Schema::table('certificates', function (Blueprint $table) {
            $table->dropIndex(['type']);
        });
    }
};
