    <!-- Floating Chat Button -->
    <button class="chat-button <?= session("user_id") ? null : "d-none" ?>" id="chatButton">
        💬
    </button>

    <!-- Chatbox -->
    <div class="chatbox" id="chatbox">
        <div class="chatbox-header">
            Chat with Seller
            <button class="close" id="closeChatbox" style="background: none; border: none; color: black;">
                <i class="fa fa-times"></i>
            </button>
        </div>
        <div class="chatbox-body" id="chatboxBody">
            <div class="loading d-flex justify-content-center align-items-center h-100 d-none">
                <div class="text-center">
                    <img src="assets/images/loading.webp" alt="Loading GIF" class="mb-3">
                    <h3 class="text-muted">Loading...</h3>
                </div>
            </div>
        </div>
        <div class="chatbox-footer d-flex align-items-center p-2" style="background-color: #f5f5f5; border-top: 1px solid #ddd;">
            <!-- Send Image -->
            <button title="Attact an image" id="sendImage" class="btn btn-link p-0 mr-2" style="font-size: 1.25rem; color: #888;">
                <i class="fa fa-camera"></i>
            </button>

            <!-- Text Input -->
            <textarea id="userMessage" class="form-control flex-grow-1" rows="1" placeholder="Aa" style="resize: none; border-radius: 20px; border: 1px solid #ccc; padding: 8px 12px; padding-right:30px;"></textarea>

            <!-- Add Emoji or Attachments -->
            <button title="Choose an emoji" id="addEmoji" class="btn btn-link p-0" style="margin-left: -30px; font-size: 1.25rem; color: #888;">
                <i class="fa fa-smile-o"></i>
            </button>

            <!-- Send Message -->
            <button id="sendMessage" class="ml-3 btn btn-primary rounded-circle d-flex justify-content-center align-items-center" style="width: 40px; height: 40px;">
                <i class="fa fa-paper-plane" style="font-size: 1rem;"></i>
            </button>

            <!-- Hidden Image Input -->
            <input type="file" id="imageInput" accept="image/*" style="display:none;">

            <!-- Emoji Picker -->
            <div id="emojiPicker" class="emoji-picker" style="display: none; position: absolute; bottom: 60px; left: 10px; z-index: 1000; border: 1px solid #ddd; background: #fff; padding: 10px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);">
                <!-- Category buttons -->
                <div class="emoji-categories" style="display: flex; flex-wrap: wrap; gap: 10px; padding-bottom: 10px; border-bottom: 1px solid #ddd;">
                    <button class="emoji-category" data-category="smileys">Smileys</button>
                    <button class="emoji-category" data-category="animals">Animals</button>
                    <button class="emoji-category" data-category="foods">Foods</button>
                    <button class="emoji-category" data-category="nature">Nature</button>
                    <button class="emoji-category" data-category="objects">Objects</button>
                    <button class="emoji-category" data-category="symbols">Symbols</button>
                    <button class="emoji-category" data-category="activities">Activities</button>
                    <button class="emoji-category" data-category="travel">Travel</button>
                </div>

                <!-- Emoji list will be populated dynamically based on selected category -->
                <div id="emojiList" style="margin-top: 10px; display: flex; flex-wrap: wrap; gap: 5px;"></div>
            </div>
        </div>
    </div>

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

    <?php include_once "../app/views/components/login_modal.php" ?>
    <?php include_once "../app/views/components/register_modal.php" ?>
    <?php include_once "../app/views/components/profile_modal.php" ?>
    <?php include_once "../app/views/components/custom_order_modal.php" ?>

    <script>
        var user_id = "<?= session("user_id") ?>";
        var user_type = "<?= session("user_type") ?>";
        var page = "<?= session("page") ?>";
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
    <script src="assets/js/dataTables.min.js"></script>
    <script src="assets/js/main.js?v=<?= version() ?>"></script>

    </body>

    </html>

    <?php session("notification", "unset") ?>