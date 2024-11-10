<?php
$database = new Database();

$user_data = null;

if (session("user_id")) {
    $user_data = $database->select_one("users", ["id" => session("user_id")]);
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
    <meta property="og:image" content="assets/images/logo-light.png">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://prototype.personalizedonlinefashion.shop/">
    <meta property="twitter:title" content="Personalized Online Fashion Shop">
    <meta property="twitter:description" content="Find your style with curated fashion picks and shop trends designed for you at the Personalized Online Fashion Shop.">
    <meta property="twitter:image" content="assets/images/logo-light.png">

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
                            <img src="assets/images/logo-bg-light.png" class="d-md-inline d-none">
                            <div class="d-md-none d-inline">
                                <img src="assets/images/logo-light.png" class="d-inline" style="height: 59px; vertical-align: middle;">
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
                                        <li><a href="javascript:void(0)" class="no-function">Account Settings</a></li>
                                        <li><a href="javascript:void(0)" class="no-function">Purchase History</a></li>
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

    <!-- ***** Main Banner Area Start ***** -->
    <div class="main-banner" id="top">
        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-6">
                    <div class="left-content">
                        <div class="thumb">
                            <div class="inner-content">
                                <h4>We Are Personalized Online Shop</h4>
                                <span>We offer a custom-tailored shopping experience with curated collections and style recommendations made just for you.</span>
                                <div class="main-border-button">
                                    <a href="products">Discover More</a>
                                </div>
                            </div>
                            <img src="assets/images/left-banner-image.jpg" alt="">
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="right-content">
                        <div class="row">
                            <div class="col-lg-6">
                                <div class="right-first-image">
                                    <div class="thumb">
                                        <div class="inner-content">
                                            <h4>Men</h4>
                                            <span>Best Clothes For Men</span>
                                        </div>
                                        <div class="hover-content">
                                            <div class="inner">
                                                <h4>Men</h4>
                                                <p>Discover top trends and classic styles for men.</p>
                                                <div class="main-border-button">
                                                    <a href="#men">Discover More</a>
                                                </div>
                                            </div>
                                        </div>
                                        <img src="assets/images/baner-right-image-02.jpg">
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="right-first-image">
                                    <div class="thumb">
                                        <div class="inner-content">
                                            <h4>Women</h4>
                                            <span>Best Clothes For Women</span>
                                        </div>
                                        <div class="hover-content">
                                            <div class="inner">
                                                <h4>Women</h4>
                                                <p>Explore a stylish selection curated just for women.</p>
                                                <div class="main-border-button">
                                                    <a href="#women">Discover More</a>
                                                </div>
                                            </div>
                                        </div>
                                        <img src="assets/images/baner-right-image-01.jpg">
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="right-first-image">
                                    <div class="thumb">
                                        <div class="inner-content">
                                            <h4>Kids</h4>
                                            <span>Best Clothes For Kids</span>
                                        </div>
                                        <div class="hover-content">
                                            <div class="inner">
                                                <h4>Kids</h4>
                                                <p>Shop comfortable and trendy styles for kids.</p>
                                                <div class="main-border-button">
                                                    <a href="#kids">Discover More</a>
                                                </div>
                                            </div>
                                        </div>
                                        <img src="assets/images/baner-right-image-03.jpg">
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="right-first-image">
                                    <div class="thumb">
                                        <div class="inner-content">
                                            <h4>Accessories</h4>
                                            <span>Best Trend Accessories</span>
                                        </div>
                                        <div class="hover-content">
                                            <div class="inner">
                                                <h4>Accessories</h4>
                                                <p>Enhance your look with our stylish accessories.</p>
                                                <div class="main-border-button">
                                                    <a href="products">Discover More</a>
                                                </div>
                                            </div>
                                        </div>
                                        <img src="assets/images/baner-right-image-04.jpg">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- ***** Main Banner Area End ***** -->

    <!-- ***** Men Area Starts ***** -->
    <section class="section" id="men">
        <div class="container">
            <div class="row">
                <div class="col-lg-6">
                    <div class="section-heading">
                        <h2>Men's Latest</h2>
                        <span>Exceptional attention to detail sets our fashion apart. Discover the latest men's styles designed to elevate your wardrobe.</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="men-item-carousel">
                        <div class="owl-men-item owl-carousel">
                            <!-- Item 1 -->
                            <div class="item">
                                <div class="thumb">
                                    <div class="hover-content">
                                        <ul>
                                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-eye"></i></a></li>
                                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-star"></i></a></li>
                                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-shopping-cart"></i></a></li>
                                        </ul>
                                    </div>
                                    <img src="assets/images/men-01.jpg" alt="Classic Spring Jacket">
                                </div>
                                <div class="down-content">
                                    <h4>Classic Spring Jacket</h4>
                                    <span>₱7014.60</span>
                                    <ul class="stars">
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                    </ul>
                                </div>
                            </div>
                            <!-- Item 2 -->
                            <div class="item">
                                <div class="thumb">
                                    <div class="hover-content">
                                        <ul>
                                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-eye"></i></a></li>
                                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-star"></i></a></li>
                                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-shopping-cart"></i></a></li>
                                        </ul>
                                    </div>
                                    <img src="assets/images/men-02.jpg" alt="Air Force 1 X Sneakers">
                                </div>
                                <div class="down-content">
                                    <h4>Air Force 1 X Sneakers</h4>
                                    <span>₱5260.95</span>
                                    <ul class="stars">
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                    </ul>
                                </div>
                            </div>
                            <!-- Item 3 -->
                            <div class="item">
                                <div class="thumb">
                                    <div class="hover-content">
                                        <ul>
                                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-eye"></i></a></li>
                                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-star"></i></a></li>
                                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-shopping-cart"></i></a></li>
                                        </ul>
                                    </div>
                                    <img src="assets/images/men-03.jpg" alt="Love Nana ‘20 Hoodie">
                                </div>
                                <div class="down-content">
                                    <h4>Love Nana ‘20 Hoodie</h4>
                                    <span>₱8768.25</span>
                                    <ul class="stars">
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                    </ul>
                                </div>
                            </div>
                            <!-- Item 4 -->
                            <div class="item">
                                <div class="thumb">
                                    <div class="hover-content">
                                        <ul>
                                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-eye"></i></a></li>
                                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-star"></i></a></li>
                                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-shopping-cart"></i></a></li>
                                        </ul>
                                    </div>
                                    <img src="assets/images/men-02.jpg" alt="Urban Explorer Coat">
                                </div>
                                <div class="down-content">
                                    <h4>Urban Explorer Coat</h4>
                                    <span>₱11691.00</span>
                                    <ul class="stars">
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- ***** Men Area Ends ***** -->

    <!-- ***** Women Area Starts ***** -->
    <section class="section" id="women">
        <div class="container">
            <div class="row">
                <div class="col-lg-6">
                    <div class="section-heading">
                        <h2>Women's Latest</h2>
                        <span>Discover trendsetting pieces crafted with care. From classic to contemporary, explore our handpicked women's collection.</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="women-item-carousel">
                        <div class="owl-women-item owl-carousel">
                            <!-- Item 1 -->
                            <div class="item">
                                <div class="thumb">
                                    <div class="hover-content">
                                        <ul>
                                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-eye"></i></a></li>
                                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-star"></i></a></li>
                                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-shopping-cart"></i></a></li>
                                        </ul>
                                    </div>
                                    <img src="assets/images/women-01.jpg" alt="Eco Green Jacket">
                                </div>
                                <div class="down-content">
                                    <h4>Eco Green Jacket</h4>
                                    <span>₱4968.68</span>
                                    <ul class="stars">
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                    </ul>
                                </div>
                            </div>
                            <!-- Item 2 -->
                            <div class="item">
                                <div class="thumb">
                                    <div class="hover-content">
                                        <ul>
                                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-eye"></i></a></li>
                                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-star"></i></a></li>
                                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-shopping-cart"></i></a></li>
                                        </ul>
                                    </div>
                                    <img src="assets/images/women-02.jpg" alt="Vintage Floral Dress">
                                </div>
                                <div class="down-content">
                                    <h4>Vintage Floral Dress</h4>
                                    <span>₱3507.30</span>
                                    <ul class="stars">
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                    </ul>
                                </div>
                            </div>
                            <!-- Item 3 -->
                            <div class="item">
                                <div class="thumb">
                                    <div class="hover-content">
                                        <ul>
                                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-eye"></i></a></li>
                                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-star"></i></a></li>
                                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-shopping-cart"></i></a></li>
                                        </ul>
                                    </div>
                                    <img src="assets/images/women-03.jpg" alt="Spring Blossom Dress">
                                </div>
                                <div class="down-content">
                                    <h4>Spring Blossom Dress</h4>
                                    <span>₱7599.15</span>
                                    <ul class="stars">
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                    </ul>
                                </div>
                            </div>
                            <!-- Item 4 -->
                            <div class="item">
                                <div class="thumb">
                                    <div class="hover-content">
                                        <ul>
                                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-eye"></i></a></li>
                                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-star"></i></a></li>
                                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-shopping-cart"></i></a></li>
                                        </ul>
                                    </div>
                                    <img src="assets/images/women-02.jpg" alt="Classic Trench Coat">
                                </div>
                                <div class="down-content">
                                    <h4>Classic Trench Coat</h4>
                                    <span>₱10521.90</span>
                                    <ul class="stars">
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- ***** Women Area Ends ***** -->

    <!-- ***** Kids Area Starts ***** -->
    <section class="section" id="kids">
        <div class="container">
            <div class="row">
                <div class="col-lg-6">
                    <div class="section-heading">
                        <h2>Kid's Latest</h2>
                        <span>Find fun, comfort, and style for kids of all ages. Discover the latest in playful, quality designs.</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="kid-item-carousel">
                        <div class="owl-kid-item owl-carousel">
                            <!-- Item 1 -->
                            <div class="item">
                                <div class="thumb">
                                    <div class="hover-content">
                                        <ul>
                                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-eye"></i></a></li>
                                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-star"></i></a></li>
                                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-shopping-cart"></i></a></li>
                                        </ul>
                                    </div>
                                    <img src="assets/images/kid-01.jpg" alt="Back-to-School Essentials">
                                </div>
                                <div class="down-content">
                                    <h4>Back-to-School Essentials</h4>
                                    <span>₱4676.40</span>
                                    <ul class="stars">
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                    </ul>
                                </div>
                            </div>
                            <!-- Item 2 -->
                            <div class="item">
                                <div class="thumb">
                                    <div class="hover-content">
                                        <ul>
                                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-eye"></i></a></li>
                                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-star"></i></a></li>
                                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-shopping-cart"></i></a></li>
                                        </ul>
                                    </div>
                                    <img src="assets/images/kid-02.jpg" alt="Sunny Day Cap">
                                </div>
                                <div class="down-content">
                                    <h4>Sunny Day Cap</h4>
                                    <span>₱701.46</span>
                                    <ul class="stars">
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                    </ul>
                                </div>
                            </div>
                            <!-- Item 3 -->
                            <div class="item">
                                <div class="thumb">
                                    <div class="hover-content">
                                        <ul>
                                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-eye"></i></a></li>
                                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-star"></i></a></li>
                                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-shopping-cart"></i></a></li>
                                        </ul>
                                    </div>
                                    <img src="assets/images/kid-03.jpg" alt="Classic Denim Set">
                                </div>
                                <div class="down-content">
                                    <h4>Classic Denim Set</h4>
                                    <span>₱1753.65</span>
                                    <ul class="stars">
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                    </ul>
                                </div>
                            </div>
                            <!-- Item 4 -->
                            <div class="item">
                                <div class="thumb">
                                    <div class="hover-content">
                                        <ul>
                                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-eye"></i></a></li>
                                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-star"></i></a></li>
                                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-shopping-cart"></i></a></li>
                                        </ul>
                                    </div>
                                    <img src="assets/images/kid-02.jpg" alt="Springtime Hoodie">
                                </div>
                                <div class="down-content">
                                    <h4>Springtime Hoodie</h4>
                                    <span>₱2338.20</span>
                                    <ul class="stars">
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                        <li><i class="fa fa-star"></i></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- ***** Kids Area Ends ***** -->

    <!-- ***** Explore Area Starts ***** -->
    <section class="section" id="explore">
        <div class="container">
            <div class="row">
                <div class="col-lg-6">
                    <div class="left-content">
                        <h2>Explore Our Unique Collection</h2>
                        <span>Discover meticulously crafted fashion that blends elegance, comfort, and style.</span>
                        <div class="quote">
                            <i class="fa fa-quote-left"></i>
                            <p>"Quality is never an accident; it is always the result of intelligent effort."</p>
                        </div>
                        <p>From timeless leather bags to chic apparel, our collection brings together the latest trends and classic designs.</p>
                        <p>We prioritize quality and creativity to make each product a statement piece that elevates your style.</p>
                        <div class="main-border-button">
                            <a href="products">Discover More</a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="right-content">
                        <div class="row">
                            <div class="col-lg-6">
                                <div class="leather">
                                    <h4>Leather Bags</h4>
                                    <span>Elegant & Durable</span>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="first-image">
                                    <img src="assets/images/explore-image-01.jpg" alt="Collection of Leather Bags">
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="second-image">
                                    <img src="assets/images/explore-image-02.jpg" alt="Various Types of Apparel">
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="types">
                                    <h4>Diverse Range</h4>
                                    <span>Over 300 Handpicked Items</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- ***** Explore Area Ends ***** -->

    <!-- ***** Social Area Starts ***** -->
    <section class="section" id="social">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="section-heading">
                        <h2>Social Media</h2>
                        <span>Details to details is what makes our online fashion shop different from the other themes.</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="row images">
                <div class="col-2">
                    <div class="thumb">
                        <div class="icon">
                            <a href="http://instagram.com">
                                <h6>Fashion</h6>
                                <i class="fa fa-instagram"></i>
                            </a>
                        </div>
                        <img src="assets/images/instagram-01.jpg" alt="">
                    </div>
                </div>
                <div class="col-2">
                    <div class="thumb">
                        <div class="icon">
                            <a href="http://instagram.com">
                                <h6>New</h6>
                                <i class="fa fa-instagram"></i>
                            </a>
                        </div>
                        <img src="assets/images/instagram-02.jpg" alt="">
                    </div>
                </div>
                <div class="col-2">
                    <div class="thumb">
                        <div class="icon">
                            <a href="http://instagram.com">
                                <h6>Brand</h6>
                                <i class="fa fa-instagram"></i>
                            </a>
                        </div>
                        <img src="assets/images/instagram-03.jpg" alt="">
                    </div>
                </div>
                <div class="col-2">
                    <div class="thumb">
                        <div class="icon">
                            <a href="http://instagram.com">
                                <h6>Makeup</h6>
                                <i class="fa fa-instagram"></i>
                            </a>
                        </div>
                        <img src="assets/images/instagram-04.jpg" alt="">
                    </div>
                </div>
                <div class="col-2">
                    <div class="thumb">
                        <div class="icon">
                            <a href="http://instagram.com">
                                <h6>Leather</h6>
                                <i class="fa fa-instagram"></i>
                            </a>
                        </div>
                        <img src="assets/images/instagram-05.jpg" alt="">
                    </div>
                </div>
                <div class="col-2">
                    <div class="thumb">
                        <div class="icon">
                            <a href="http://instagram.com">
                                <h6>Bag</h6>
                                <i class="fa fa-instagram"></i>
                            </a>
                        </div>
                        <img src="assets/images/instagram-06.jpg" alt="">
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- ***** Social Area Ends ***** -->

    <!-- ***** Subscribe Area Starts ***** -->
    <div class="subscribe">
        <div class="container">
            <div class="row">
                <div class="col-lg-8">
                    <div class="section-heading">
                        <h2>Subscribe to Our Newsletter & Enjoy 30% Off</h2>
                        <span>Get exclusive updates and deals only for our subscribers. Stay stylish with the latest trends.</span>
                    </div>
                    <form id="subscribe_form" action="javascript:void(0)">
                        <div class="row">
                            <div class="col-lg-5">
                                <fieldset>
                                    <input name="name" type="text" id="name" placeholder="Your Name" required="">
                                </fieldset>
                            </div>
                            <div class="col-lg-5">
                                <fieldset>
                                    <input name="email" type="email" id="email" placeholder="Your Email Address" required="">
                                </fieldset>
                            </div>
                            <div class="col-lg-2">
                                <fieldset>
                                    <button type="submit" id="form-submit" class="main-dark-button">
                                        <i class="fa fa-paper-plane"></i>
                                    </button>
                                </fieldset>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="col-lg-4">
                    <div class="row">
                        <div class="col-6">
                            <ul>
                                <li>Store Location:<br><span>Kasiglahan Village, San Jose Montalban Rizal 1860</span></li>
                                <li>Phone:<br><span>091-234-5678</span></li>
                                <li>Office Location:<br><span>San Jose Rizal</span></li>
                            </ul>
                        </div>
                        <div class="col-6">
                            <ul>
                                <li>Work Hours:<br><span>07:30 AM - 9:30 PM Daily</span></li>
                                <li>Email:<br><span><a href="mailto:PersonalizedOnlineShop@gmail.com">PersonalizedOnlineShop@gmail.com</a></span></li>
                                <li>Follow Us:<br>
                                    <span>
                                        <a href="javascript:void(0)" class="no-function">Facebook</a>,
                                        <a href="javascript:void(0)" class="no-function">Instagram</a>,
                                        <a href="javascript:void(0)" class="no-function">Behance</a>,
                                        <a href="javascript:void(0)" class="no-function">LinkedIn</a>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- ***** Subscribe Area Ends ***** -->

    <!-- ***** Footer Start ***** -->
    <footer>
        <div class="container">
            <div class="row">
                <div class="col-lg-3">
                    <div class="first-item">
                        <div class="logo">
                            <img src="assets/images/logo-bg-dark.png" class="img-fluid" alt="Personalized Online Fashion Shop Logo">
                        </div>
                        <ul>
                            <li><a href="#">Collegio De Montalban, Kasiglahan Village, San Jose Montalban, Rizal 1860</a></li>
                            <li><a href="mailto:PersonalizedOnlineShop@gmail.com">PersonalizedOnlineShop@gmail.com</a></li>
                            <li><a href="tel:0912345678">091-234-5678</a></li>
                        </ul>
                    </div>
                </div>
                <div class="col-lg-3">
                    <h4>Shopping &amp; Categories</h4>
                    <ul>
                        <li><a href="#men">Men's Collection</a></li>
                        <li><a href="#women">Women's Collection</a></li>
                        <li><a href="#kids">Kids' Collection</a></li>
                    </ul>
                </div>
                <div class="col-lg-3">
                    <h4>Useful Links</h4>
                    <ul>
                        <li><a href="/">Homepage</a></li>
                        <li><a href="products">Products</a></li>
                        <li><a href="about_us">About Us</a></li>
                        <li><a href="contact_us">Contact Us</a></li>
                    </ul>
                </div>
                <div class="col-lg-3">
                    <h4>Help &amp; Information</h4>
                    <ul>
                        <li><a href="javascript:void(0)" class="no-function">Help Center</a></li>
                        <li><a href="javascript:void(0)" class="no-function">FAQs</a></li>
                        <li><a href="javascript:void(0)" class="no-function">Shipping Info</a></li>
                        <li><a href="javascript:void(0)" class="no-function">Order Tracking</a></li>
                    </ul>
                </div>
                <div class="col-lg-12">
                    <div class="under-footer">
                        <p>&copy; 2024 Personalized Online Shop | All Rights Reserved.</p>
                        <ul>
                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-facebook"></i></a></li>
                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-twitter"></i></a></li>
                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-linkedin"></i></a></li>
                            <li><a href="javascript:void(0)" class="no-function"><i class="fa fa-behance"></i></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    <!-- ***** Footer Ends ***** -->

    <!-- Login Modal -->
    <div class="modal fade" id="login_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Login</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form action="javascript:void(0)" id="login_form">
                    <div class="modal-body">
                        <div class="loading text-center py-5 d-none">
                            <img src="assets/images/loading.gif" alt="Loading GIF" class="mb-3">
                            <h3 class="text-muted">Loading...</h3>
                        </div>
                        <div class="main-form">
                            <div class="alert alert-danger text-center d-none" id="login_alert">Invalid Username or Password!</div>

                            <div class="form-group">
                                <label for="login_username">Username</label>
                                <input type="text" class="form-control" id="login_username" required>
                            </div>
                            <div class="form-group">
                                <label for="login_password">Password</label>
                                <input type="password" class="form-control" id="login_password" required>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary" id="login_submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    
    <!-- Register Modal -->
    <div class="modal fade" id="register_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Create an Account</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form action="javascript:void(0)" id="register_form">
                    <div class="modal-body">
                        <div class="loading text-center py-5 d-none">
                            <img src="assets/images/loading.gif" alt="Loading GIF" class="mb-3">
                            <h3 class="text-muted">Loading...</h3>
                        </div>
                        <div class="main-form">
                            <div class="alert alert-danger text-center d-none" id="register_alert">Username is already taken!</div>

                            <div class="form-group">
                                <label for="register_name">Name</label>
                                <input type="text" class="form-control" id="register_name" required>
                            </div>
                            <div class="form-group">
                                <label for="register_username">Username</label>
                                <input type="text" class="form-control" id="register_username" required>
                            </div>
                            <div class="form-group">
                                <label for="register_password">Password</label>
                                <input type="password" class="form-control" id="register_password" required>
                            </div>
                            <div class="form-group">
                                <label for="register_confirm_password">Confirm Password</label>
                                <input type="password" class="form-control" id="register_confirm_password" required>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary" id="register_submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script>
        var user_id = "<?= session("user_id") ?>";
        var user_type = "<?= session("user_type") ?>";
        var notification = <?= session("notification") ? json_encode(session("notification")) : json_encode(null) ?>;
    </script>

    <script src="assets/js/jquery-2.1.0.min.js"></script>
    <script src="assets/js/popper.js"></script>
    <script src="assets/js/bootstrap.min.js"></script>
    <script src="assets/js/owl-carousel.js"></script>
    <script src="assets/js/accordions.js"></script>
    <script src="assets/js/datepicker.js"></script>
    <script src="assets/js/scrollreveal.min.js"></script>
    <script src="assets/js/waypoints.min.js"></script>
    <script src="assets/js/jquery.counterup.min.js"></script>
    <script src="assets/js/imgfix.min.js"></script>
    <script src="assets/js/slick.js"></script>
    <script src="assets/js/lightbox.js"></script>
    <script src="assets/js/isotope.js"></script>
    <script src="assets/js/sweetalert2.min.js"></script>
    <script src="assets/js/custom.min.js"></script>
    <script src="assets/js/main.js"></script>
</body>

</html>

<?php session("notification", "unset") ?>