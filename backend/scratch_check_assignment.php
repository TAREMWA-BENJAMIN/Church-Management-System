<?php
$u = App\Models\User::where('email', 'proannoying64@gmail.com')->first();
echo json_encode($u->roleAssignments()->get());
