<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('document')->unique();
            $table->string('phone');
            $table->string('email')->nullable();
            $table->string('address')->nullable();
            $table->string('status')->default('active');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('pets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('species');
            $table->string('breed');
            $table->string('sex');
            $table->date('birth_date');
            $table->decimal('weight', 8, 2)->default(0);
            $table->string('color')->nullable();
            $table->string('status')->default('active');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->cascadeOnDelete();
            $table->foreignId('pet_id')->constrained()->cascadeOnDelete();
            $table->string('service');
            $table->date('date');
            $table->time('time');
            $table->string('status')->default('scheduled');
            $table->string('veterinarian')->nullable();
            $table->text('notes')->nullable();
            $table->index(['date', 'time']);
            $table->timestamps();
        });

        Schema::create('medical_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pet_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->string('reason');
            $table->text('diagnosis');
            $table->text('treatment');
            $table->text('vaccines')->nullable();
            $table->string('attachments')->nullable();
            $table->text('observations')->nullable();
            $table->string('veterinarian')->nullable();
            $table->index('date');
            $table->timestamps();
        });

        Schema::create('inventory_products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category');
            $table->string('sku')->unique();
            $table->integer('stock')->default(0);
            $table->integer('min_stock')->default(0);
            $table->decimal('price', 10, 2)->default(0);
            $table->string('status')->default('active');
            $table->index('status');
            $table->timestamps();
        });

        Schema::create('inventory_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('inventory_products')->cascadeOnDelete();
            $table->string('type');
            $table->integer('quantity');
            $table->string('reason');
            $table->index('type');
            $table->timestamps();
        });

        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->cascadeOnDelete();
            $table->string('concept');
            $table->decimal('amount', 10, 2);
            $table->string('method');
            $table->string('status')->default('paid');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
        Schema::dropIfExists('inventory_movements');
        Schema::dropIfExists('inventory_products');
        Schema::dropIfExists('medical_records');
        Schema::dropIfExists('appointments');
        Schema::dropIfExists('pets');
        Schema::dropIfExists('clients');
    }
};
