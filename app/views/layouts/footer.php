    <?php include_once "../app/views/components/login_modal.php" ?>
    <?php include_once "../app/views/components/register_modal.php" ?>
    <?php include_once "../app/views/components/profile_modal.php" ?>

    <!-- ***** Footer Start ***** -->
    <footer>
        <div class="container">
            <div class="row">
                <div class="col-lg-3">
                    <div class="first-item">
                        <div class="logo">
                            <img src="assets/images/logo-bg-dark.webp" class="img-fluid" alt="Personalized Online Fashion Shop Logo">
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
                        <li><a href="<?= session("page") == "home" ? "#men" : "/#men" ?>">Men's Collection</a></li>
                        <li><a href="<?= session("page") == "home" ? "#women" : "/#women" ?>">Women's Collection</a></li>
                        <li><a href="<?= session("page") == "home" ? "#kids" : "/#kids" ?>">Kids' Collection</a></li>
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
                            <li><a href="https://www.facebook.com/profile.php?id=100064269721973&sk=about&section=bio" target="_blank" rel="noopener noreferrer"><i class="fa fa-facebook"></i></a></li>
                            <li><a href="https://www.instagram.com/personalizeonlineshop/" target="_blank" rel="noopener noreferrer"><i class="fa fa-instagram"></i></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    <!-- ***** Footer Ends ***** -->

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
    <script src="assets/js/dataTables.js"></script>
    <script src="assets/js/dataTables.bootstrap4.js"></script>
    <script src="assets/js/main.js?v=<?= version() ?>"></script>
    
    </body>

    </html>

    <?php session("notification", "unset") ?>