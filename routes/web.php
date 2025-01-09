<?php
$routes = [
    // Normal Pages
    '' => '../app/views/pages/home.php',
    'home' => '../app/views/pages/home.php',
    'products' => '../app/views/pages/products.php',
    'about_us' => '../app/views/pages/about_us.php',
    'contact_us' => '../app/views/pages/contact_us.php',
    'cart' => '../app/views/pages/cart.php',
    'placed_orders' => '../app/views/pages/placed_orders.php',
    'my_purchases' => '../app/views/pages/my_purchases.php',
    'order_tracking' => '../app/views/pages/order_tracking.php',

    // Admin Pages
    'admin' => '../app/views/admin/dashboard.php',
    'admin/dashboard' => '../app/views/admin/dashboard.php',
    'admin/manage_products' => '../app/views/admin/manage_products.php',
    'admin/system_updates' => '../app/views/admin/system_updates.php',
    'admin/customer_messages' => '../app/views/admin/customer_messages.php',
    'admin/manage_orders' => '../app/views/admin/manage_orders.php',
    
    // Server
    'server' => '../app/controllers/Controller.php',

    // Error Pages
    '403' => '../app/views/errors/403.php',
    '404' => '../app/views/errors/404.php',
    '500' => '../app/views/errors/500.php',
];
