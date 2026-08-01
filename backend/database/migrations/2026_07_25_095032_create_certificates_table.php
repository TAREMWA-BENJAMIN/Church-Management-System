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
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // Marriage, Baptism, Confirmation
            $table->string('certificate_number')->unique();
            $table->string('recipient_name');
            $table->json('details')->nullable(); // Additional data like sponsors, parents, dates
            $table->date('issued_date');
            
            // Relationships
            $table->foreignId('organization_unit_id')->constrained()->cascadeOnDelete(); // The Parish
            $table->foreignId('diocese_id')->constrained('organization_units')->cascadeOnDelete(); // The Diocese for tracking
            $table->foreignId('issued_by_user_id')->constrained('users')->cascadeOnDelete(); // The Priest
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certificates');
    }
};
