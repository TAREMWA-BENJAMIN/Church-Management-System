<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query()
            ->select('id', 'name', 'email', 'role', 'diocese_id', 'archdeaconry_id', 'parish_id')
            ->orderBy('name');

        if ($request->has('role')) {
            $roleInput = $request->query('role');
            \Log::info('UserController@index role query param received:', ['role' => $roleInput]);
            
            $roles = is_array($roleInput) ? $roleInput : explode(',', $roleInput);
            $query->whereIn('role', $roles);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'unique:users,email'],
            'role' => ['required', 'string', Rule::in([
                'SuperAdmin',
                'Archbishop',
                'Bishop',
                'Assistant Bishop',
                'Archdeacon',
                'Canon',
                'Dean',
                'Parish Priest',
                'Assistant Priest',
                'Deacon',
                'Lay Reader',
            ])],
            'diocese_id' => ['nullable', 'integer'],
            'archdeaconry_id' => ['nullable', 'integer'],
            'parish_id' => ['nullable', 'integer'],
        ]);

        $user = User::create($data);

        return response()->json($user->only(['id', 'name', 'email', 'role', 'diocese_id', 'archdeaconry_id', 'parish_id']), 201);
    }

    public function show(User $user)
    {
        return response()->json($user->only(['id', 'name', 'email', 'role', 'diocese_id', 'archdeaconry_id', 'parish_id']));
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'nullable', 'email', Rule::unique('users')->ignore($user->id)],
            'role' => ['sometimes', 'required', 'string', Rule::in([
                'SuperAdmin',
                'Archbishop',
                'Bishop',
                'Assistant Bishop',
                'Archdeacon',
                'Canon',
                'Dean',
                'Parish Priest',
                'Assistant Priest',
                'Deacon',
                'Lay Reader',
            ])],
            'diocese_id' => ['nullable', 'integer'],
            'archdeaconry_id' => ['nullable', 'integer'],
            'parish_id' => ['nullable', 'integer'],
        ]);

        $user->fill($data);
        $user->save();

        return response()->json($user->only(['id', 'name', 'email', 'role', 'diocese_id', 'archdeaconry_id', 'parish_id']));
    }

    public function destroy(User $user)
    {
        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}
