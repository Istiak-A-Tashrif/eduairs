<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserRoleController extends Controller
{
    public function assignRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|string|in:Admin,User',
        ]);

        $user->syncRoles([$request->role]);

        return response()->json([
            'message' => 'Role assigned successfully',
            'user' => $user->load('roles')
        ]);
    }
}