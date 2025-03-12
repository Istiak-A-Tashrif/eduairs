<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * Get the statistics for the dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        
        // Get the total number of products
        $totalProducts = Product::count();
       
        $myProducts = Product::count();

        return response()->json([
            'totalProducts' => $totalProducts,
            'myProducts' => $myProducts
        ]);
    }
}
