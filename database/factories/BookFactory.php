<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\Book;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class BookFactory extends Factory
{
    /**
     * Corresponding model
     */
    protected $model = Book::class;

    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(10),
            // Generate a random dog image URL
            'image' => 'https://placedog.net/' . $this->faker->numberBetween(2, 10) * 100 . '/' . $this->faker->numberBetween(2, 10) * 100,
            'price' => $this->faker->randomFloat(2, 5, 100),
            'genre' => $this->faker->randomElement(['Fantasy', 'Sci-Fi', 'Adventure', 'Thriller', 'Romance']),
        ];
    }
}
