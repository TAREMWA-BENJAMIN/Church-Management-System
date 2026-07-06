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
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('SuperAdmin');
            $table->foreignId('diocese_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('archdeaconry_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('parish_id')->nullable()->constrained()->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['diocese_id']);
            $table->dropForeign(['archdeaconry_id']);
            $table->dropForeign(['parish_id']);
            $table->dropColumn(['role', 'diocese_id', 'archdeaconry_id', 'parish_id']);
        });
    }
};
