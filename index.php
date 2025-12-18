<?php
// Get requested page from URL, default to 'index'
$page = $_GET['page'] ?? 'index';

// Define valid routes
$routes = [
    //  Page identifier => View file name
    'index' => 'index',
    'products' => 'products',
    'categories' => 'categories',
    'login' => 'login',
    'logout' => 'logout',
];

// Check if route exists
if (!isset($routes[$page])) {
    http_response_code(404);
    echo "404 – Seite nicht gefunden";
    exit;
}

// Determine page name
$page_name = $routes[$page];

// Loading view
require __DIR__ . "/view/{$page_name}.php";
