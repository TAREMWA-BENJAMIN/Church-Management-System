<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_super_admin_can_list_users(): void
    {
        $admin = User::create([
            'name' => 'System Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'),
            'role' => 'SuperAdmin',
        ]);

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/users');

        $response->assertOk();
        $response->assertJsonStructure([
            '*' => [
                'id',
                'name',
                'email',
                'role',
                'phone_number',
            ],
        ]);
    }
}
