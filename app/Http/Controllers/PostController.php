<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::with(['user:id,name', 'category:id,name', 'tags:id,name', 'comments']);

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%$search%")
                  ->orWhere('body', 'like', "%$search%");
            });
        }

        $posts = $query->paginate(10);
        return response()->json($posts);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required',
            'body' => 'required',
            'category_id' => 'required|exists:categories,id',
            'tags' => 'array',
            'tags.*' => 'exists:tags,id',
            'cover_image' => 'image|nullable'
        ]);

        $data['slug'] = Str::slug($data['title']);
        $data['user_id'] = $request->user()->id;

        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('posts', 'public');
            $data['cover_image'] = $path;
        }

        $post = Post::create($data);
        if (isset($data['tags'])) {
            $post->tags()->sync($data['tags']);
        }

        return response()->json($post, 201);
    }

    public function show(Post $post)
    {
        $post->load(['user:id,name', 'category:id,name', 'tags:id,name', 'comments.user:id,name']);
        return response()->json($post);
    }

    public function update(Request $request, Post $post)
    {
        $this->authorize('update', $post);
        $data = $request->validate([
            'title' => 'sometimes|required',
            'body' => 'sometimes|required',
            'category_id' => 'sometimes|exists:categories,id',
            'tags' => 'array',
            'tags.*' => 'exists:tags,id',
            'cover_image' => 'image|nullable'
        ]);

        if (isset($data['title'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('posts', 'public');
            $data['cover_image'] = $path;
        }

        $post->update($data);
        if (isset($data['tags'])) {
            $post->tags()->sync($data['tags']);
        }

        return response()->json($post);
    }

    public function destroy(Post $post)
    {
        $this->authorize('delete', $post);
        $post->delete();
        return response()->json(null, 204);
    }
}
