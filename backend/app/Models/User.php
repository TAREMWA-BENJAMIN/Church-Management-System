<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'diocese_id',
        'archdeaconry_id',
        'parish_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function diocese()
    {
        return $this->belongsTo(Diocese::class);
    }

    public function archdeaconry()
    {
        return $this->belongsTo(Archdeaconry::class);
    }

    public function parish()
    {
        return $this->belongsTo(Parish::class);
    }

    public function isSuperAdmin()
    {
        return $this->role === 'SuperAdmin';
    }

    public function canAccessFullDirectory()
    {
        return in_array($this->role, ['SuperAdmin', 'Archbishop', 'Bishop']);
    }

    public function isDioceseAdmin()
    {
        return $this->role === 'DioceseAdmin';
    }

    public function isArchdeaconAdmin()
    {
        return $this->role === 'ArchdeaconAdmin';
    }

    public function isParishAdmin()
    {
        return in_array($this->role, ['ParishAdmin', 'Priest', 'Secretary', 'Treasurer', 'CellLeader']);
    }
}
