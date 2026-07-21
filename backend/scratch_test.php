<?php
$request = Illuminate\Http\Request::create('/directorates', 'GET');
$request->headers->set('X-Inertia', 'true');
$ctrl = new App\Http\Controllers\DirectorateController();
$res = $ctrl->index();
$content = $res->toResponse($request)->getContent();
echo $content;
