<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * List all users
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $users = User::with('favorites')->get();

        /**
         * In case of api request
         */
        if ($request->route()->getPrefix() === 'api') {
            return response()->json($users);
        }

        return Inertia::render('Users/Index', [
            'currentUser' => auth()->user(),
            'users' => $users
        ]);
    }

    /**
     * View a specific user
     *
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user);
    }

    /**
     * Edit a specific user
     *
     * @param Request $request
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $user = User::find($id);

        logger($user);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Validate the incoming request data
        $request->validate([
            'email' => 'required|email',
            'password' => 'nullable|min:5',
        ]);

        logger($request->input('name'));
        logger($request->input('email'));
        logger($request->input('password'));
        // Update user fields
        $user->name = $request->input('name');
        $user->email = $request->input('email');
        if ($request->input('password')) {
            $user->password = bcrypt($request->input('password'));
        }
        $user->save();


        logger($user->save());

        return response()->json(['message' => 'User updated successfully', 'user' => $user]);
    }

    /**
     * Delete a specific user
     *
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}
