<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateRegularUser extends Command
{
    protected $signature = 'create:user {name} {email} {password}';
    protected $description = 'Create a regular user';

    public function handle()
    {
        $user = User::create([
            'name' => $this->argument('name'),
            'email' => $this->argument('email'),
            'password' => Hash::make($this->argument('password')),
        ]);

        $user->assignRole('User');

        $this->info('User created successfully');
    }
}