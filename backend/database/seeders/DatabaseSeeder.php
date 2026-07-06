<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Diocese;
use App\Models\Archdeaconry;
use App\Models\Parish;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $dioceses = [
            ['name' => 'Ankole', 'bishop_name' => 'Fred Sheldon Mwesigwa'],
            ['name' => 'Bukedi', 'bishop_name' => 'Samuel Egesa'],
            ['name' => 'Busoga', 'bishop_name' => 'Paul Naimanhye'],
            ['name' => 'Central Buganda', 'bishop_name' => 'Michael Lubowa'],
            ['name' => 'Central Busoga', 'bishop_name' => 'Patrick Wakula'],
            ['name' => 'East Ruwenzori', 'bishop_name' => 'George Turyasingura'],
            ['name' => 'Kampala', 'bishop_name' => 'Stephen Samuel Kaziimba Mugalu'],
            ['name' => 'Kigezi', 'bishop_name' => 'Gaddie Akanjuna'],
            ['name' => 'Kinkiizi', 'bishop_name' => 'Dan Zoreka'],
            ['name' => 'Kitgum', 'bishop_name' => 'Wilson Kitara'],
            ['name' => 'Kumi', 'bishop_name' => 'Michael Okwii Esakhan'],
            ['name' => 'Lango', 'bishop_name' => 'Alfred Olwa'],
            ['name' => 'Luweero', 'bishop_name' => 'Wilson Kiseka'],
            ['name' => 'Madi–West Nile', 'bishop_name' => 'Collins Andaku'],
            ['name' => 'Masindi Kitara', 'bishop_name' => 'George Kasangaki'],
            ['name' => 'Mbale', 'bishop_name' => 'John Wilson Nandaah'],
            ['name' => 'Mityana', 'bishop_name' => 'James Bukomeko'],
            ['name' => 'Muhabura', 'bishop_name' => 'Godfrey Mbitse'],
            ['name' => 'Mukono', 'bishop_name' => 'Enos Kitto Kagodo'],
            ['name' => 'Namirembe', 'bishop_name' => 'Moses Banja'],
            ['name' => 'Nebbi', 'bishop_name' => 'Pons Ozelle'],
            ['name' => 'North Ankole', 'bishop_name' => 'Alfred Muhoozi'],
            ['name' => 'North Karamoja', 'bishop_name' => 'Simon Aisu'],
            ['name' => 'North Kigezi', 'bishop_name' => 'Onesimus Asiimwe'],
            ['name' => 'North Mbale', 'bishop_name' => 'Samuel Gidudu'],
            ['name' => 'Northern Uganda', 'bishop_name' => 'Godfrey Loum'],
            ['name' => 'North West Ankole', 'bishop_name' => 'Amos Magezi'],
            ['name' => 'Ruwenzori', 'bishop_name' => 'Reuben Kisembo'],
            ['name' => 'Sebei', 'bishop_name' => 'Paul Masaba'],
            ['name' => 'Soroti', 'bishop_name' => 'Kosea Odongo'],
            ['name' => 'South Ankole', 'bishop_name' => 'Nathan Ahimbisibwe'],
            ['name' => 'South Ruwenzori', 'bishop_name' => 'Nason Baluku'],
            ['name' => 'West Ankole', 'bishop_name' => 'Johnson Twinomujuni'],
            ['name' => 'West Buganda', 'bishop_name' => 'Henry Katumba-Tamale'],
            ['name' => 'West Lango', 'bishop_name' => 'Julius Ceasar Nina'],
            ['name' => 'West Nile', 'bishop_name' => 'Godfrey Loum'],
            ['name' => 'West Rwenzori', 'bishop_name' => 'Reuben Kisembo'],
            ['name' => 'Karamoja', 'bishop_name' => 'Simon Aisu'],
        ];

        foreach ($dioceses as $data) {
            Diocese::updateOrCreate(
                ['name' => $data['name']],
                ['bishop_name' => $data['bishop_name']]
            );
        }

        // Add a Diocese of Kampala to make sure old code doesn't break if it expects "Diocese of Kampala"
        // (However, the list provided 'Kampala'. We'll stick to 'Kampala')

        // Ensure mock data for frontend demo still exists under Kampala
        $kampala = Diocese::where('name', 'Kampala')->first();
        if ($kampala) {
            $central = Archdeaconry::updateOrCreate(
                ['diocese_id' => $kampala->id, 'name' => 'Central Archdeaconry']
            );
            $centralParishes = [
                "All Saints' Cathedral, Nakasero", "All Saints Chapel, Lweza", "St. Stephen's Kitara",
                "St. Francis Chapel, Makerere University", "Kabanyolo Chapel", "St. John's Makerere",
                "St. Peter's Wandegeya", "St. Nicholas Kalerwe", "Holy Trinity Kivulu", "St. Paul's Mulago",
                "St. Luke's Chapel Mulago", "Allied Health Anglican Chapel", "St. John's Kamwokya",
                "St. James Kifumbiro", "St. Philip's Kyebando Kisalosalo"
            ];
            foreach ($centralParishes as $parishName) {
                Parish::updateOrCreate(['archdeaconry_id' => $central->id, 'name' => $parishName]);
            }

            $eastern = Archdeaconry::updateOrCreate(
                ['diocese_id' => $kampala->id, 'name' => 'Eastern Archdeaconry']
            );
            $easternParishes = [
                "St. Luke's Ntinda", "St. Peter's Naguru", "St. Paul's Mbuya–Kiwanawataka", "Kakumba Chapel"
            ];
            foreach ($easternParishes as $parishName) {
                Parish::updateOrCreate(['archdeaconry_id' => $eastern->id, 'name' => $parishName]);
            }

            $southern = Archdeaconry::updateOrCreate(
                ['diocese_id' => $kampala->id, 'name' => 'Southern Archdeaconry']
            );
            $southernParishes = [
                "Kisugu", "Muyenga", "Kansanga", "Ggaba", "Luzira", "Bugolobi"
            ];
            foreach ($southernParishes as $parishName) {
                Parish::updateOrCreate(['archdeaconry_id' => $southern->id, 'name' => $parishName]);
            }
        }

        // Add Dummy Users for RBAC Testing
        User::updateOrCreate(
            ['email' => 'super@cms.com'],
            ['name' => 'System Admin', 'password' => Hash::make('password'), 'role' => 'SuperAdmin']
        );

        if ($kampala) {
            User::updateOrCreate(
                ['email' => 'kampala@cms.com'],
                ['name' => 'Kampala Diocese Admin', 'password' => Hash::make('password'), 'role' => 'DioceseAdmin', 'diocese_id' => $kampala->id]
            );

            $centralArchdeaconry = Archdeaconry::where('name', 'Central Archdeaconry')->first();
            if ($centralArchdeaconry) {
                User::updateOrCreate(
                    ['email' => 'central@cms.com'],
                    ['name' => 'Central Archdeaconry Admin', 'password' => Hash::make('password'), 'role' => 'ArchdeaconAdmin', 'archdeaconry_id' => $centralArchdeaconry->id]
                );

                $nakaseroParish = Parish::where('name', "All Saints' Cathedral, Nakasero")->first();
                if ($nakaseroParish) {
                    User::updateOrCreate(
                        ['email' => 'nakasero@cms.com'],
                        ['name' => 'Nakasero Parish Admin', 'password' => Hash::make('password'), 'role' => 'ParishAdmin', 'parish_id' => $nakaseroParish->id]
                    );
                    User::updateOrCreate(
                        ['email' => 'secretary@cms.com'],
                        ['name' => 'Parish Secretary', 'password' => Hash::make('password'), 'role' => 'Secretary', 'parish_id' => $nakaseroParish->id]
                    );
                    User::updateOrCreate(
                        ['email' => 'treasurer@cms.com'],
                        ['name' => 'Parish Treasurer', 'password' => Hash::make('password'), 'role' => 'Treasurer', 'parish_id' => $nakaseroParish->id]
                    );
                    User::updateOrCreate(
                        ['email' => 'cellleader@cms.com'],
                        ['name' => 'Cell Leader', 'password' => Hash::make('password'), 'role' => 'CellLeader', 'parish_id' => $nakaseroParish->id]
                    );
                }
            }
        }
    }
}
