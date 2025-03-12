<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run()
    {
        // Create roles
        $adminRole = Role::create(['name' => 'Admin']);
        $userRole = Role::create(['name' => 'User']);

        // Create permissions
        $viewAdminDashboard = Permission::create(['name' => 'view admin dashboard']);
        $manageProducts = Permission::create(['name' => 'manage products']);
        $viewProducts = Permission::create(['name' => 'view products']);

        // Assign permissions to roles
        $adminRole->givePermissionTo([
            $viewAdminDashboard,
            $manageProducts,
            $viewProducts
        ]);

        $userRole->givePermissionTo([
            $viewProducts
        ]);
    }
}