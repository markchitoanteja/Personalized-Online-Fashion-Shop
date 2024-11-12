<?php
date_default_timezone_set('Asia/Manila');

require_once '../config/helpers.php';
require_once '../config/database.php';
require_once '../routes/web.php';
require_once '../app/models/Model.php';

$uri = parse_url(trim($_SERVER['REQUEST_URI'], '/'), PHP_URL_PATH);

$admin_pages = ["admin", "admin/dashboard", "admin/manage_products"];
$excluded_pages = array_merge(["403", "404", "500", "server"], $admin_pages);

if (array_key_exists($uri, $routes)) {
    new Database();
    new Model();

    session("page", $uri ?: "home");

    $pageContent = $routes[$uri];

    if (!in_array(session("page"), $excluded_pages)) {
        include_once '../app/views/layouts/base.php';
    } else {
        require_once $pageContent;
    }
} else {
    redirect("404", 404);
}
