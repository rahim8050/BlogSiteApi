<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Post $post)
    {
        return response()->json($post->comments()->with('user:id,name')->get());
    }

    public function store(Request $request, Post $post)
    {
        $data = $request->validate(['body' => 'required']);
        $data['user_id'] = $request->user()->id;
        $comment = $post->comments()->create($data);
        return response()->json($comment, 201);
    }

    public function update(Request $request, Comment $comment)
    {
        $this->authorize('update', $comment);
        $data = $request->validate(['body' => 'required']);
        $comment->update($data);
        return response()->json($comment);
    }

    public function destroy(Comment $comment)
    {
        $this->authorize('delete', $comment);
        $comment->delete();
        return response()->json(null, 204);
    }
}
