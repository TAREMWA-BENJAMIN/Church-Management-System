<?php

namespace Tests\Unit;

use App\Models\User;
use PHPUnit\Framework\TestCase;

class UserTest extends TestCase
{
    public function test_full_directory_access_is_granted_to_provincial_roles(): void
    {
        $this->assertTrue((new User(['role' => 'SuperAdmin']))->canAccessFullDirectory());
        $this->assertTrue((new User(['role' => 'Archbishop']))->canAccessFullDirectory());
        $this->assertTrue((new User(['role' => 'Bishop']))->canAccessFullDirectory());
        $this->assertFalse((new User(['role' => 'DioceseAdmin']))->canAccessFullDirectory());
        $this->assertFalse((new User(['role' => 'ArchdeaconAdmin']))->canAccessFullDirectory());
    }
}
