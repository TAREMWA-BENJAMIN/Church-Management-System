<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('directorates', function (Blueprint $table) {
            $table->decimal('revenue', 14, 2)->default(0)->after('description');
            $table->boolean('is_active')->default(true)->after('revenue');
        });
    }

    public function down(): void
    {
        Schema::table('directorates', function (Blueprint $table) {
            $table->dropColumn(['revenue', 'is_active']);
        });
    }
};
