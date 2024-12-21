<?php
$database = new Database();

$mens = $database->select_many("products", ["category" => "men"], "", "id", "DESC");
$womens = $database->select_many("products", ["category" => "women"], "", "id", "DESC");
$kids = $database->select_many("products", ["category" => "kids"], "", "id", "DESC");
?>

<!-- ***** Main Banner Area Start ***** -->
<div class="main-banner" id="top">
    <div class="container-fluid">
        <div class="row">
            <div class="col-lg-6">
                <div class="left-content">
                    <div class="thumb">
                        <div class="inner-content">
                            <h4>We Are Personalized Online Shop</h4>

                            <span class="d-lg-block d-none">We offer a custom-tailored shopping experience with curated collections and style recommendations made just for you.</span>
                            
                            <div class="main-border-button">
                                <a href="products">Discover More</a>
                            </div>
                        </div>
                        <img src="assets/images/left-banner-image.webp" alt="">
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
                                    <img src="assets/images/baner-right-image-02.webp">
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
                                    <img src="assets/images/baner-right-image-01.webp">
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
                                    <img src="assets/images/baner-right-image-03.webp">
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
                                    <img src="assets/images/baner-right-image-04.webp">
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
                <?php if ($mens) : ?>
                    <div class="men-item-carousel">
                        <div class="owl-men-item owl-carousel">
                            <?php foreach ($mens as $men): ?>
                                <div class="item">
                                    <div class="thumb">
                                        <div class="hover-content">
                                            <ul>
                                                <li><a href="javascript:void(0)" class="view_product" product_id="<?= $men["id"] ?>"><i class="fa fa-eye"></i></a></li>
                                                <li><a href="javascript:void(0)" class="add_to_cart" product_id="<?= $men["id"] ?>"><i class="fa fa-shopping-cart"></i></a></li>
                                            </ul>
                                        </div>
                                        <img src="uploads/products/<?= htmlspecialchars($men["image"], ENT_QUOTES, 'UTF-8') ?>" alt="<?= htmlspecialchars($men["name"], ENT_QUOTES, 'UTF-8') ?>" style="aspect-ratio: 37 / 39; width: 100%; height: auto;">
                                    </div>
                                    <div class="down-content">
                                        <h4 class="text-truncate" title="<?= $men["name"] ?>"><?= $men["name"] ?></h4>
                                        <span>₱<?= number_format($men["price"], 2) ?></span>
                                    </div>
                                </div>
                            <?php endforeach ?>
                        </div>
                    </div>
                <?php else: ?>
                    <h1 class="text-center text-muted">No Available Data</h1>
                <?php endif ?>
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
                <?php if ($womens): ?>
                    <div class="women-item-carousel">
                        <div class="owl-women-item owl-carousel">
                            <?php foreach ($womens as $women): ?>
                                <div class="item">
                                    <div class="thumb">
                                        <div class="hover-content">
                                            <ul>
                                                <li><a href="javascript:void(0)" class="view_product" product_id="<?= $women["id"] ?>"><i class="fa fa-eye"></i></a></li>
                                                <li><a href="javascript:void(0)" class="add_to_cart" product_id="<?= $women["id"] ?>"><i class="fa fa-shopping-cart"></i></a></li>
                                            </ul>
                                        </div>
                                        <img src="uploads/products/<?= htmlspecialchars($women["image"], ENT_QUOTES, 'UTF-8') ?>" alt="<?= htmlspecialchars($women["name"], ENT_QUOTES, 'UTF-8') ?>" style="aspect-ratio: 37 / 39; width: 100%; height: auto;">
                                    </div>
                                    <div class="down-content">
                                        <h4 class="text-truncate" title="<?= $women["name"] ?>"><?= $women["name"] ?></h4>
                                        <span>₱<?= number_format($women["price"], 2) ?></span>
                                    </div>
                                </div>
                            <?php endforeach ?>
                        </div>
                    </div>
                <?php else: ?>
                    <h1 class="text-center text-muted">No Available Data</h1>
                <?php endif ?>
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
                <?php if ($kids): ?>
                    <div class="kid-item-carousel">
                        <div class="owl-kid-item owl-carousel">
                            <?php foreach ($kids as $kid): ?>
                                <div class="item">
                                    <div class="thumb">
                                        <div class="hover-content">
                                            <ul>
                                                <li><a href="javascript:void(0)" class="view_product" product_id="<?= $kid["id"] ?>"><i class="fa fa-eye"></i></a></li>
                                                <li><a href="javascript:void(0)" class="add_to_cart" product_id="<?= $kid["id"] ?>"><i class="fa fa-shopping-cart"></i></a></li>
                                            </ul>
                                        </div>
                                        <img src="uploads/products/<?= htmlspecialchars($kid["image"], ENT_QUOTES, 'UTF-8') ?>" alt="<?= htmlspecialchars($kid["name"], ENT_QUOTES, 'UTF-8') ?>" style="aspect-ratio: 37 / 39; width: 100%; height: auto;">
                                    </div>
                                    <div class="down-content">
                                        <h4 class="text-truncate" title="<?= $kid["name"] ?>"><?= $kid["name"] ?></h4>
                                        <span>₱<?= number_format($kid["price"], 2) ?></span>
                                    </div>
                                </div>
                            <?php endforeach ?>
                        </div>
                    </div>
                <?php else: ?>
                    <h1 class="text-center text-muted">No Available Data</h1>
                <?php endif ?>
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
                                <img src="assets/images/explore-image-01.webp" alt="Collection of Leather Bags">
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="second-image">
                                <img src="assets/images/explore-image-02.webp" alt="Various Types of Apparel">
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
                    <img src="assets/images/instagram-01.webp" alt="">
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
                    <img src="assets/images/instagram-02.webp" alt="">
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
                    <img src="assets/images/instagram-03.webp" alt="">
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
                    <img src="assets/images/instagram-04.webp" alt="">
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
                    <img src="assets/images/instagram-05.webp" alt="">
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
                    <img src="assets/images/instagram-06.webp" alt="">
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
                                    <a href="https://www.facebook.com/profile.php?id=100064269721973&sk=about&section=bio" target="_blank" rel="noopener noreferrer">Facebook</a>,
                                    <a href="https://www.instagram.com/personalizeonlineshop/" target="_blank" rel="noopener noreferrer">Instagram</a>,
                                    <a href="javascript:void(0)" class="no-function">Twitter</a>,
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

<?php include_once "../app/views/components/product_details_modal.php" ?>