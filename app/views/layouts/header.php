<?php
$database = new Database();

$user_data = null;

if (session("user_id")) {
    $user_data = $database->select_one("users", ["id" => session("user_id")]);

    if ((session("user_type") == "developer") || (session("user_type") == "admin")) {
        redirect("admin/dashboard");
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Discover your style at the Personalized Online Fashion Shop. Get curated fashion recommendations and shop the latest trends tailored to you.">
    <meta name="author" content="Colegio de Montalban">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://prototype.personalizedonlinefashion.shop/">
    <meta property="og:title" content="Personalized Online Fashion Shop">
    <meta property="og:description" content="Explore custom fashion recommendations and shop trends tailored just for you at the Personalized Online Fashion Shop.">
    <meta property="og:image" content="https://prototype.personalizedonlinefashion.shop/assets/images/logo-light.webp">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://prototype.personalizedonlinefashion.shop/">
    <meta property="twitter:title" content="Personalized Online Fashion Shop">
    <meta property="twitter:description" content="Find your style with curated fashion picks and shop trends designed for you at the Personalized Online Fashion Shop.">
    <meta property="twitter:image" content="https://prototype.personalizedonlinefashion.shop/assets/images/logo-light.webp">

    <title>Personalized Online Fashion Shop</title>

    <!-- Favicon -->
    <link rel="icon" href="favicon.ico" type="image/x-icon">

    <!-- Fonts and CSS -->
    <link href="https://fonts.googleapis.com/css?family=Poppins:100,200,300,400,500,600,700,800,900&display=swap" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="assets/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="assets/css/font-awesome.css">
    <link rel="stylesheet" type="text/css" href="assets/css/templatemo-hexashop.css">
    <link rel="stylesheet" type="text/css" href="assets/css/owl-carousel.css">
    <link rel="stylesheet" type="text/css" href="assets/css/lightbox.css">
    <link rel="stylesheet" type="text/css" href="assets/css/sweetalert2.min.css">
</head>

<body>
    <!-- ***** Preloader Start ***** -->
    <div id="preloader">
        <div class="jumper">
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
    <!-- ***** Preloader End ***** -->

    <!-- ***** Header Area Start ***** -->
    <header class="header-area header-sticky">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <nav class="main-nav">
                        <!-- ***** Logo Start ***** -->
                        <a href="/" class="logo">
                            <img src="assets/images/logo-bg-light.webp" class="d-md-inline d-none">
                            <div class="d-md-none d-inline">
                                <img src="assets/images/logo-light.webp" class="d-inline" style="height: 59px; vertical-align: middle;">
                                <h5 class="text-dark d-inline" style="margin-left: 8px; vertical-align: middle;"><b>POF Shop</b></h5>
                            </div>
                        </a>
                        <!-- ***** Logo End ***** -->
                        <!-- ***** Menu Start ***** -->
                        <ul class="nav">
                            <li><a href="/" class="<?= session("page") == "home" ? "active" : null ?>">Home</a></li>
                            <li><a href="products" class="<?= session("page") == "products" ? "active" : null ?>">Products</a></li>
                            <li><a href="about_us" class="<?= session("page") == "about_us" ? "active" : null ?>">About Us</a></li>
                            <li><a href="contact_us" class="<?= session("page") == "contact_us" ? "active" : null ?>">Contact Us</a></li>

                            <?php if ($user_data): ?>
                                <li class="submenu">
                                    <a href="javascript:void(0)"><?= $user_data["name"] ?></a>
                                    <ul>
                                        <li><a href="javascript:void(0)" class="profile">Profile</a></li>
                                        <li><a href="javascript:void(0)" class="no-function">Cart <span class="badge badge-danger badge-pill ml-3">2</span></a></li>
                                        <li><a href="javascript:void(0)" class="no-function">Orders</a></li>
                                        <li><a href="javascript:void(0)" class="logout">Logout</a></li>
                                    </ul>
                                </li>
                            <?php else: ?>
                                <li class="submenu">
                                    <a href="javascript:void(0)">Account</a>
                                    <ul>
                                        <li><a href="javascript:void(0)" data-toggle="modal" data-target="#login_modal">Login</a></li>
                                        <li><a href="javascript:void(0)" data-toggle="modal" data-target="#register_modal">Register</a></li>
                                    </ul>
                                </li>
                            <?php endif ?>
                        </ul>
                        <a class='menu-trigger'>
                            <span>Menu</span>
                        </a>
                        <!-- ***** Menu End ***** -->
                    </nav>
                </div>
            </div>
        </div>
    </header>