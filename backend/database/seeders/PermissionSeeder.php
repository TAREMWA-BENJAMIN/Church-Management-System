<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create basic permissions
        $permissions = [
            'view_organizations',
            'manage_organizations',
            'view_users',
            'manage_users',
            'view_roles',
            'manage_roles',
            'view_finances',
            'manage_finances',
            'view_reports'
        ];

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission, 'web');
        }

        // Create a Super Admin role and assign all permissions
        $role = Role::findOrCreate('Super Admin', 'web');
        $role->givePermissionTo(Permission::all());
    }
}
