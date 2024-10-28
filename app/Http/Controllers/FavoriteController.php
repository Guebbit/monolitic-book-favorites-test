<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function addFavorite(Book $book)
    {
        auth()->user()->favoriteBooks()->attach($book->id);
        return response()->json(['message' => 'Book added to favorites']);
    }

    public function removeFavorite(Book $book)
    {
        auth()->user()->favoriteBooks()->detach($book->id);
        return response()->json(['message' => 'Book removed from favorites']);
    }

    public function getFavorites()
    {
        return auth()->user()->favoriteBooks;
    }
}
