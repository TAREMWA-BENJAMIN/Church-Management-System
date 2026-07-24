<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\OrganizationUnit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MemberController extends Controller
{
    public function index()
    {
        $members = Member::with('organizationUnit')->latest()->get();
        $units = OrganizationUnit::all();

        return Inertia::render('Members/Index', [
            'members' => $members,
            'units' => $units
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'organization_unit_id' => 'required|exists:organization_units,id',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|string|in:Male,Female',
            'phone_number' => 'nullable|string|max:255',
            'status' => 'required|string|in:active,inactive',
            'role' => 'nullable|string|max:255',
        ]);

        Member::create($validated);

        return redirect()->back()->with('success', 'Member registered successfully.');
    }

    public function update(Request $request, Member $member)
    {
        $validated = $request->validate([
            'organization_unit_id' => 'required|exists:organization_units,id',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|string|in:Male,Female',
            'phone_number' => 'nullable|string|max:255',
            'status' => 'required|string|in:active,inactive',
            'role' => 'nullable|string|max:255',
        ]);

        $member->update($validated);

        return redirect()->back()->with('success', 'Member updated successfully.');
    }

    public function destroy(Member $member)
    {
        $member->delete();
        return redirect()->back()->with('success', 'Member deleted successfully.');
    }
}
