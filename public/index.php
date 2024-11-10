<?php
date_default_timezone_set('Asia/Manila');

require_once '../config/helpers.php';
require_once '../config/database.php';
require_once '../routes/web.php';
require_once '../app/models/Model.php';

$uri = trim($_SERVER['REQUEST_URI'], '/');

$excluded_pages = ["403", "404", "500", "server", "login"];

if (array_key_exists($uri, $routes)) {
    $database = new Database();
    $model = new Model();

    $_SESSION["page"] = $uri ?: 'login';

    $pageContent = $routes[$uri];

    if (!in_array($_SESSION["page"], $excluded_pages)) {
        include_once '../app/views/layouts/base.php';
    } else {
        require_once $pageContent;
    }
} else {
    http_response_code(404);
    header("Location: /404");
    exit();
}
