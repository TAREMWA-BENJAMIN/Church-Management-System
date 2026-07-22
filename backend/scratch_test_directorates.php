<?php

// Simulate user 2 login
$user = App\Models\User::find(2);
Auth::login($user);

try {
    $controller = new App\Http\Controllers\DirectorateController();
    $response = $controller->index();
    echo "Response class: " . get_class($response) . "\n";
    if (method_exists($response, 'toResponse')) {
        $res = $response->toResponse(request());
        echo "Status code: " . $res->getStatusCode() . "\n";
        if ($res->isRedirect()) {
            echo "Redirect Target: " . $res->headers->get('Location') . "\n";
        }
    }
} catch (\Throwable $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
}
