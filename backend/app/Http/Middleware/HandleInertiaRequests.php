<?php

namespace App\Http\Middleware;

use App\Models\MessageRecipient;
use App\Models\OrganizationUnit;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user'             => $request->user(),
                'is_super_admin'   => $request->user() ? $request->user()->is_super_admin : false,
                'allowed_unit_ids' => $request->user() ? $request->user()->getAllowedOrganizationUnitIds() : [],
                'roles'            => $request->user() ? $request->user()->roles->pluck('name') : [],
            ],
            // Unread message count shared to all pages for the sidebar badge
            'unreadMessageCount' => function () use ($request) {
                if (!$request->user()) return 0;

                $user = $request->user();
                $unitIds = $user->is_super_admin
                    ? OrganizationUnit::withoutGlobalScope('organizationUnitSecurity')->pluck('id')->toArray()
                    : $user->roleAssignments()->pluck('organization_unit_id')->toArray();

                if (empty($unitIds)) return 0;

                return MessageRecipient::whereIn('organization_unit_id', $unitIds)
                    ->where('is_read', false)
                    ->whereHas('message', fn($q) => $q->whereNull('parent_id'))
                    ->count();
            },
        ];
    }
}

