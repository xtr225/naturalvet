<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table): void {
            $table->string('type')->default('income')->after('status');
            $table->string('category')->nullable()->after('type');
            $table->string('service')->nullable()->after('category');
            $table->date('transaction_date')->nullable()->after('service');
            $table->string('raw_method')->nullable()->after('transaction_date');
            $table->string('source')->nullable()->after('raw_method');
            $table->text('notes')->nullable()->after('source');
        });

        Schema::create('vet_notifications', function (Blueprint $table): void {
            $table->id();
            $table->string('channel')->default('whatsapp');
            $table->string('phone');
            $table->string('title');
            $table->text('message');
            $table->string('status')->default('pending');
            $table->dateTime('scheduled_at')->nullable();
            $table->dateTime('sent_at')->nullable();
            $table->text('whatsapp_url')->nullable();
            $table->string('related_type')->nullable();
            $table->unsignedBigInteger('related_id')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['status', 'scheduled_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vet_notifications');

        Schema::table('payments', function (Blueprint $table): void {
            $table->dropColumn([
                'type',
                'category',
                'service',
                'transaction_date',
                'raw_method',
                'source',
                'notes',
            ]);
        });
    }
};
