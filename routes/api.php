<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\TagController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('posts', [PostController::class, 'index']);
Route::get('posts/{post}', [PostController::class, 'show']);

Route::get('categories', [CategoryController::class, 'index']);
Route::get('tags', [TagController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('posts', PostController::class)->except(['index', 'show']);
    Route::apiResource('categories', CategoryController::class)->except(['index']);
    Route::apiResource('tags', TagController::class)->except(['index']);
    Route::apiResource('posts.comments', CommentController::class)->shallow();
});
