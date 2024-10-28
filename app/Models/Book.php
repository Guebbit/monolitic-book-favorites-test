<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Book extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'image', 'price', 'genre'];

    /**
     * Users who have favorited this book
     *
     * @return BelongsToMany
     */
    public function favoritedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'favorites');
    }

    /**
     * Get genre list
     * @return mixed
     */
    public static function getGenres()
    {
        return Book::select('genre')
            ->groupBy('genre')
            ->pluck('genre')
            ->toArray();
    }

    /**
     * @param $query
     * @return mixed
     */
    public static function search(string $query)
    {
        return Book::where('name', 'like', '%' . $query . '%')
            ->orWhere('description', 'like', '%' . $query . '%')
            ->get();
    }

    /**
     * @return BelongsToMany
     */
    public function usersFavorited(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'favorites');
    }
}
