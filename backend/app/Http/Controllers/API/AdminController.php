<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboard()
    {
        return response()->json([
            'message' => 'Welcome to the admin dashboard'
        ]);
    }

    public function getUsers()
    {
        // Only return a paginated list of users with their roles
        $users = User::with('roles')->paginate(10);
        return response()->json($users);
    }

    // Get statistics
    public function getStatistics()
    {
        // Calculate total users, products, and categories
        $totalUsers = User::count();
        $totalProducts = Product::count();

        return response()->json([
            'totalUsers' => $totalUsers,
            'totalProducts' => $totalProducts,
        ]);
    }
}
