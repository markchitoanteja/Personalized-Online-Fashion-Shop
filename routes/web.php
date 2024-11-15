<?php
$routes = [
    // Normal Pages
    '' => '../app/views/pages/home.php',
    'home' => '../app/views/pages/home.php',
    'products' => '../app/views/pages/products.php',
    'about_us' => '../app/views/pages/about_us.php',
    'contact_us' => '../app/views/pages/contact_us.php',

    // Admin Pages
    'admin' => '../app/views/admin/dashboard.php',
    'admin/dashboard' => '../app/views/admin/dashboard.php',
    'admin/manage_products' => '../app/views/admin/manage_products.php',
    'admin/manage_orders' => '../app/views/admin/manage_orders.php',
    'admin/print_order' => '../app/views/admin/print_order.php',

    // Server
    'server' => '../app/controllers/Controller.php',

    // Error Pages
    '403' => '../app/views/errors/403.php',
    '404' => '../app/views/errors/404.php',
    '500' => '../app/views/errors/500.php',
];
