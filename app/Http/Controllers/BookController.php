<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookController extends Controller
{
    /**
     * Get books, all of them or  just the ones that match the search
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|\Inertia\Response
     */
    public function index(Request $request)
    {
        // Search parameters
        $searchName = $request->input('name');
        $searchDescription = $request->input('description');
        $searchGenres = $request->input('genres');
        if($searchName || $searchGenres){

            $books = Book::query();
            if($searchName){
                $books->where('name', 'like', '%'.$searchName.'%');
            }
            if($searchDescription){
                $books->where('description', 'like', '%'.$searchDescription.'%');
            }
            if($searchGenres){
                $books->whereIn('genre', explode(',', $searchGenres));
            }
            $books = $books->get();

        } else {
            // Get everything
            $books = Book::all();
        }

        // Get static genres
        $genres = Book::getGenres();

        // User favorites (if any)
        $favorites = [];
        if(auth()->user()){
            $favorites = auth()->user()->favorites;
        }

        // In case of api request
        if ($request->route()->getPrefix() === 'api') {
            return response()->json($books);
        }

        // In case of web request
        return Inertia::render('Books/Index', [
            'currentUser' => auth()->user(),
            'books' => $books,
            'genres' => $genres,
            'favorites' => $favorites
        ]);
    }

    /**
     * Show target book
     *
     * @param Request $request
     * @param $id
     * @return \Illuminate\Http\JsonResponse|\Inertia\Response
     */
    public function show(Request $request, $id)
    {
        $book = Book::findOrFail($id);

        if ($request->route()->getPrefix() === 'api') {
            return response()->json($book);
        }

        return Inertia::render('Books/Details', [
            'currentUser' => auth()->user(),
            'book' => $book,
        ]);
    }

    /**
     * Show target book and enable editing mode
     * If no $id is provided, then it's a creation page.
     *
     * @param Request $request
     * @param $id
     * @return \Illuminate\Http\JsonResponse|\Inertia\Response
     */
    public function edit(Request $request, $id = null)
    {
        $book = null;
        if($id)
            $book = Book::findOrFail($id);

        return Inertia::render('Books/Details', [
            'currentUser' => auth()->user(),
            'book' => $book,
            'create' => true
        ]);
    }

    /**
     * Create book (ADMIN ONLY)
     *
     * @param Request $request
     * @return void
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'description' => 'required',
            'image' => 'nullable|string',
            'price' => 'required|numeric',
        ]);

        $book = Book::create($request->all());

        return response()->json(['id' => $book->id], 201);
    }

    /**
     * Edit target book (ADMIN ONLY)
     *
     * @param Request $request
     * @return void
     */
    public function update(Request $request, Book $book)
    {
        $request->validate([
            'name' => 'required',
            'description' => 'required',
            'image' => 'nullable|string',
            'price' => 'required|numeric',
        ]);

        $book->update($request->all());
    }

    public function destroy(Book $book)
    {
        $book->delete();
    }
}
