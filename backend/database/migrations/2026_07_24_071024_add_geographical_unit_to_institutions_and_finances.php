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
        Schema::table('institutions', function (Blueprint $table) {
            $table->foreignId('geographical_unit_id')->nullable()->constrained('organization_units')->onDelete('set null');
        });

        Schema::table('finance_records', function (Blueprint $table) {
            $table->foreignId('institution_id')->nullable()->constrained('institutions')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('institutions_and_finances', function (Blueprint $table) {
            //
        });
    }
};
