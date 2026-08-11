<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use App\Models\OrganizationUnit;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class CertificateController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        
        // Find the user's primary assigned parish/diocese
        $allowedUnitIds = $user->getAllowedOrganizationUnitIds();
        
        $query = Certificate::with(['issuedBy', 'organizationUnit', 'diocese'])
            ->orderBy('issued_date', 'desc');
            
        if (!$user->is_super_admin && !empty($allowedUnitIds)) {
            $query->where(function($q) use ($allowedUnitIds) {
                $q->whereIn('organization_unit_id', $allowedUnitIds)
                  ->orWhereIn('diocese_id', $allowedUnitIds);
            });
        }

        if ($request->has('search') && !empty($request->search)) {
            $search = strtolower($request->search);
            $query->where(function($q) use ($search) {
                $q->whereRaw('LOWER(recipient_name) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(certificate_number) LIKE ?', ["%{$search}%"]);
            });
        }

        $certificates = $query->paginate(10)->withQueryString();

        return Inertia::render('Certificates/Index', [
            'certificates' => $certificates
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|string|in:Marriage,Baptism,Confirmation',
            'recipient_name' => 'required|string|max:255',
            'issued_date' => 'required|date',
            'details' => 'nullable|array',
        ]);

        $user = auth()->user();
        $roleAssignment = $user->roleAssignments()->first();
        
        if ($roleAssignment) {
            $parish = OrganizationUnit::findOrFail($roleAssignment->organization_unit_id);
        } else {
            // Fallback for super admins or users without explicit assignments
            $parish = OrganizationUnit::first();
        }
        
        // Find the diocese for this parish (traverse up the tree)
        $dioceseId = null;
        
        if ($parish->type && $parish->type->name === 'Diocese') {
            $dioceseId = $parish->id;
        } else {
            $currentUnit = $parish;
            while ($currentUnit && $currentUnit->parent_id) {
                $parent = OrganizationUnit::with('type')->find($currentUnit->parent_id);
                if ($parent && $parent->type->name === 'Diocese') {
                    $dioceseId = $parent->id;
                    break;
                }
                $currentUnit = $parent;
            }
        }
        
        // Fallback to the parish itself if no diocese is found in the hierarchy to avoid database constraint errors
        if (!$dioceseId) {
            $dioceseId = $parish->id;
        }

        $certificate = Certificate::create([
            'type' => $request->type,
            'certificate_number' => strtoupper(Str::random(10)),
            'recipient_name' => $request->recipient_name,
            'details' => $request->details,
            'issued_date' => $request->issued_date,
            'organization_unit_id' => $parish->id,
            'diocese_id' => $dioceseId,
            'issued_by_user_id' => Auth::id(),
        ]);

        return redirect()->back()->with('success', 'Certificate generated successfully.');
    }

    public function downloadPdf(Certificate $certificate)
    {
        $certificate->load(['organizationUnit', 'diocese', 'issuedBy']);
        
        // Try to find the Bishop for the Diocese
        $bishopSignature = null;
        if ($certificate->diocese_id) {
            // Find a user assigned to this diocese role (we assume the one with highest permissions or specifically 'Bishop' role, for simplicity we find an admin of that Diocese)
            $bishopUser = \App\Models\User::whereHas('roleAssignments', function($q) use ($certificate) {
                $q->where('organization_unit_id', $certificate->diocese_id);
            })->whereNotNull('signature_path')->first();
            
            if ($bishopUser) {
                $bishopSignature = storage_path('app/public/' . $bishopUser->signature_path);
            }
        }

        $priestSignature = null;
        if ($certificate->issuedBy && $certificate->issuedBy->signature_path) {
            $priestSignature = storage_path('app/public/' . $certificate->issuedBy->signature_path);
        }

        // Select the template based on certificate type
        $templateView = match ($certificate->type) {
            'Marriage'     => 'certificates.marriage',
            'Confirmation' => 'certificates.confirmation',
            'Baptism'      => 'certificates.baptism',
            default        => 'certificates.template',
        };

        $pdf = Pdf::loadView($templateView, compact('certificate', 'bishopSignature', 'priestSignature'));
        
        // Landscape for certificates
        $pdf->setPaper('a4', 'landscape');
        
        return $pdf->download($certificate->type . '_' . $certificate->recipient_name . '.pdf');
    }
}
