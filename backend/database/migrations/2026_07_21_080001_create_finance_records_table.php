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
        Schema::create('finance_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_unit_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['income', 'expenditure']);
            $table->foreignId('recorded_by')->constrained('users')->onDelete('cascade');
            $table->string('category'); // e.g., 'tithe', 'givings', 'donations', 'salaries', etc.
            $table->decimal('amount', 15, 2);
            $table->text('description')->nullable();
            $table->date('date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('finance_records');
    }
};
