<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user()->load('roles');
        
        return response()->json([
            'user' => $user,
            'permissions' => $user->getAllPermissions()->pluck('name')
        ]);
    }
}