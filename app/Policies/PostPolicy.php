<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;

class PostPolicy
{
    public function viewAny(?User $user = null): bool
    {
        return true;
    }

    public function view(?User $user, Post $post): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->isEditor() || $user->isAuthor();
    }

    public function update(User $user, Post $post): bool
    {
        if ($user->isAdmin() || $user->isEditor()) {
            return true;
        }

        return $user->isAuthor() && $user->id === $post->user_id;
    }

    public function delete(User $user, Post $post): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }
}
