<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role' => User::ROLE_ADMIN,
        ]);

        User::factory()->create([
            'name' => 'Editor User',
            'email' => 'editor@example.com',
            'role' => User::ROLE_EDITOR,
        ]);

        User::factory()->create([
            'name' => 'Author User',
            'email' => 'author@example.com',
            'role' => User::ROLE_AUTHOR,
        ]);

        User::factory()->create([
            'name' => 'Reader User',
            'email' => 'reader@example.com',
            'role' => User::ROLE_READER,
        ]);
    }
}
