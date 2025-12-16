<?php
$page = $_GET['page'] ?? 'index';

$routes = [
    'index' => 'index',
    'products' => 'products',
    'categories' => 'categories',
    'login' => 'login',
    'logout' => 'logout',
];

if (!isset($routes[$page])) {
    http_response_code(404);
    echo "404 – Seite nicht gefunden";
    exit;
}

// 🔑 HIER setzen wir page_name zentral
$page_name = $routes[$page];

// View laden
require __DIR__ . "/view/{$page_name}.php";
