jQuery(document).ready(function () {
    const url = new URL(window.location.href);
    const secretKeyCombination = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    const emojis = {
        smileys: [
            "😀", "😃", "😄", "😁", "😆", "😊", "😍", "😘", "😋", "😂",
            "🤣", "😜", "😝", "😛", "🤑", "😎", "🤓", "😏", "😒", "😞"
        ],
        animals: [
            "🐶", "🐱", "🐭", "🐹", "🐰", "🐸", "🦁", "🐯", "🐻", "🐨",
            "🐷", "🐮", "🐰", "🐻‍❄️", "🦊", "🐦", "🦅", "🦆", "🦢", "🦉"
        ],
        foods: [
            "🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍒",
            "🍓", "🍍", "🍑", "🍈", "🍋", "🥥", "🥝", "🍍", "🍉", "🍇"
        ],
        nature: [
            "🌳", "🌲", "🌵", "🌾", "🌻", "🌼", "🌷", "🌹", "🍀", "🌺",
            "🌻", "🌲", "🌳", "🌾", "🌻", "🍁", "🍂", "🍃", "🍄", "🌷"
        ],
        objects: [
            "💻", "📱", "🖥️", "🖨️", "⌚", "🖱️", "💡", "📷", "📺", "🎧",
            "🎤", "🎬", "🖼️", "📸", "📚", "🎮", "🧸", "🎲", "📓", "📝"
        ],
        symbols: [
            "❤️", "💔", "💥", "💫", "✨", "🔥", "💣", "🔔", "🔕", "🎵",
            "🎶", "🔊", "🔉", "🔆", "📣", "📯", "🔮", "🔗", "🔑", "🗝️"
        ],
        activities: [
            "⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏉", "🎱", "🥏", "🏓",
            "🏸", "🏒", "🏑", "🥅", "⛳", "🏌️‍♂️", "🏇", "🚴‍♂️", "🚴‍♀️", "🚣‍♀️"
        ],
        travel: [
            "🌍", "🌎", "🌏", "✈️", "🚂", "🚗", "🚕", "🚌", "🚎", "🚙",
            "🚘", "🚖", "🚓", "🚑", "🚒", "🚐", "🚚", "🚛", "🚜", "🛴"
        ]
    };
    var conversations = [];
    var keySequence = [];
    var is_chatbox_open = false;

    check_unread_messages(user_id);
    toggleInspectRestriction(true);
    populateEmojiList("smileys");

    if (url.searchParams.has('fbclid')) {
        url.searchParams.delete('fbclid');

        window.history.replaceState({}, document.title, url.pathname + url.search);
    }

    if (notification) {
        Swal.fire({
            title: notification.title,
            text: notification.text,
            icon: notification.icon
        });
    }

    $(".datatable").DataTable({
        ordering: false
    })

    $('a[href^="#"]').on('click', function (e) {
        e.preventDefault();

        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top
        }, 800);
    })

    $(".no-function").click(function () {
        Swal.fire({
            title: "Feature Not Available",
            text: "This function is not yet available. Please check back later.",
            icon: "warning"
        });
    })

    $(".logout").click(function () {
        var formData = new FormData();

        formData.append('action', 'logout');

        $.ajax({
            url: 'server',
            data: formData,
            type: 'POST',
            dataType: 'JSON',
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.success) {
                    if (page == "cart" || page == "orders") {
                        location.href = "/";
                    } else {
                        location.reload();
                    }
                }
            },
            error: function (_, _, error) {
                console.error(error);
            }
        });
    })

    $("#login_form").submit(function () {
        const username = $("#login_username").val();
        const password = $("#login_password").val();
        const remember_me = $("#login_remember_me").is(":checked");

        $("#login_alert").addClass("d-none");

        is_loading(true, "login");

        var formData = new FormData();

        formData.append('username', username);
        formData.append('password', password);
        formData.append('remember_me', remember_me);

        formData.append('action', 'login');

        $.ajax({
            url: 'server',
            data: formData,
            type: 'POST',
            dataType: 'JSON',
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.success) {
                    location.reload();
                } else {
                    setTimeout(function () {
                        $("#login_alert").removeClass("d-none");

                        is_loading(false, "login");
                    }, 1500);
                }
            },
            error: function (_, _, error) {
                console.error(error);
            }
        });
    })

    $("#register_form").submit(function () {
        const first_name = $("#register_first_name").val();
        const middle_name = $("#register_middle_name").val();
        const last_name = $("#register_last_name").val();
        const birthday = $("#register_birthday").val();
        const email = $("#register_email").val();
        const mobile_number = $("#register_mobile_number").val();
        const address = $("#register_address").val();
        const username = $("#register_username").val();
        const password = $("#register_password").val();
        const confirm_password = $("#register_confirm_password").val();
        const image = $("#register_image").prop("files")[0];

        $("#register_alert").addClass("d-none");

        is_loading(true, "register");

        if (password != confirm_password) {
            $("#register_alert").text("Passwords do not match!");
            $("#register_alert").removeClass("d-none");

            $("#register_password").addClass("is-invalid");
            $("#register_confirm_password").addClass("is-invalid");

            is_loading(false, "register");
        } else {
            var formData = new FormData();

            formData.append('first_name', first_name);
            formData.append('middle_name', middle_name);
            formData.append('last_name', last_name);
            formData.append('birthday', birthday);
            formData.append('email', email);
            formData.append('mobile_number', mobile_number);
            formData.append('address', address);
            formData.append('username', username);
            formData.append('password', password);
            formData.append('image', image);

            formData.append('action', 'register');

            $.ajax({
                url: 'server',
                data: formData,
                type: 'POST',
                dataType: 'JSON',
                processData: false,
                contentType: false,
                success: function (response) {
                    const error_username = response.message.is_error_username;
                    const error_email = response.message.is_error_email;

                    if (!error_username && !error_email) {
                        location.reload();
                    } else {
                        if (error_username) {
                            $("#error_register_username").removeClass("d-none");
                            $("#register_username").addClass("is-invalid");

                            $("#register_username").focus();
                        }

                        if (error_email) {
                            $("#error_register_email").removeClass("d-none");
                            $("#register_email").addClass("is-invalid");

                            $("#register_email").focus();
                        }

                        is_loading(false, "register");
                    }
                },
                error: function (_, _, error) {
                    console.error(error);
                }
            });
        }
    })

    $("#register_image").change(function (event) {
        try {
            const reader = new FileReader();

            reader.onload = function (e) {
                $('#register_image_display').attr('src', e.target.result);
            };

            reader.readAsDataURL(event.target.files[0]);
        } catch {
            $('#register_image_display').attr('src', "uploads/users/default-user-image.png");
        }
    })

    $("#register_username").keydown(function () {
        $("#error_register_username").addClass("d-none");
        $("#register_username").removeClass("is-invalid");
    })

    $("#register_email").keydown(function () {
        $("#error_register_email").addClass("d-none");
        $("#register_email").removeClass("is-invalid");
    })

    $("#register_password").keydown(function () {
        $("#register_alert").addClass("d-none");

        $("#register_password").removeClass("is-invalid");
        $("#register_confirm_password").removeClass("is-invalid");
    })

    $("#register_confirm_password").keydown(function () {
        $("#register_alert").addClass("d-none");

        $("#register_password").removeClass("is-invalid");
        $("#register_confirm_password").removeClass("is-invalid");
    })

    $("#subscribe_form").submit(function () {
        const name = $("#subscribe_name").val();
        const email = $("#subscribe_email").val();

        $("#subscribe_name").attr("disabled", true);
        $("#subscribe_email").attr("disabled", true);
        $("#subscribe_submit").attr("disabled", true);

        $("#paper_plane_icon").addClass("d-none");
        $("#loading_icon").removeClass("d-none");

        var formData = new FormData();

        formData.append('name', name);
        formData.append('email', email);

        formData.append('action', 'subscribe');

        $.ajax({
            url: 'server',
            data: formData,
            type: 'POST',
            dataType: 'JSON',
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.success) {
                    location.reload();
                } else {
                    $("#subscribe_name").removeAttr("disabled");
                    $("#subscribe_email").removeAttr("disabled");
                    $("#subscribe_submit").removeAttr("disabled");

                    $("#paper_plane_icon").removeClass("d-none");
                    $("#loading_icon").addClass("d-none");

                    $("#error_subscribe_email").removeClass("d-none");

                    $("#subscribe_email").focus();
                }
            },
            error: function (_, _, error) {
                console.error(error);
            }
        });
    })

    $("#subscribe_email").keydown(function () {
        $("#error_subscribe_email").addClass("d-none");
    })

    $("#contact_us_form").submit(function () {
        const name = $("#contact_us_name").val();
        const email = $("#contact_us_email").val();
        const message = $("#contact_us_message").val();

        $("#contact_us_name").attr("disabled", true);
        $("#contact_us_email").attr("disabled", true);
        $("#contact_us_message").attr("disabled", true);
        $("#contact_us_submit").attr("disabled", true);

        $("#paper_plane_icon_2").addClass("d-none");
        $("#loading_icon_2").removeClass("d-none");

        var formData = new FormData();

        formData.append('name', name);
        formData.append('email', email);
        formData.append('message', message);

        formData.append('action', 'contact_us');

        $.ajax({
            url: 'server',
            data: formData,
            type: 'POST',
            dataType: 'JSON',
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.success) {
                    location.reload();
                }
            },
            error: function (_, _, error) {
                console.error(error);
            }
        });
    })

    $(".profile").click(function () {
        const id = user_id;

        is_loading(true, "profile");

        $("#profile_modal").modal("show");

        var formData = new FormData();

        formData.append('id', id);

        formData.append('action', 'get_profile_data');

        $.ajax({
            url: 'server',
            data: formData,
            type: 'POST',
            dataType: 'JSON',
            processData: false,
            contentType: false,
            success: function (response) {
                const profile_data = response.message;

                $("#profile_image_display").attr("src", "uploads/users/" + profile_data.image);

                $("#profile_first_name").val(profile_data.first_name);
                $("#profile_middle_name").val(profile_data.middle_name);
                $("#profile_last_name").val(profile_data.last_name);
                $("#profile_birthday").val(profile_data.birthday);
                $("#profile_email").val(profile_data.email);
                $("#profile_mobile_number").val(profile_data.mobile_number);
                $("#profile_address").val(profile_data.address);
                $("#profile_username").val(profile_data.username);

                $("#profile_user_id").val(profile_data.user_id);
                $("#profile_old_email").val(profile_data.email);
                $("#profile_old_username").val(profile_data.username);
                $("#profile_old_password").val(profile_data.password);
                $("#profile_old_image").val(profile_data.image);

                is_loading(false, "profile");
            },
            error: function (_, _, error) {
                console.error(error);
            }
        });
    })

    $("#profile_image").change(function (event) {
        try {
            const reader = new FileReader();

            reader.onload = function (e) {
                $('#profile_image_display').attr('src', e.target.result);
            };

            reader.readAsDataURL(event.target.files[0]);
        } catch {
            $('#profile_image_display').attr('src', "uploads/users/" + $("#profile_old_image").val());
        }
    })

    $("#profile_username").keydown(function () {
        $("#error_register_username").addClass("d-none");
        $("#profile_username").removeClass("is-invalid");
    })

    $("#profile_email").keydown(function () {
        $("#error_register_email").addClass("d-none");
        $("#profile_email").removeClass("is-invalid");
    })

    $("#profile_password").keydown(function () {
        $("#profile_alert").addClass("d-none");

        $("#profile_password").removeClass("is-invalid");
        $("#profile_confirm_password").removeClass("is-invalid");
    })

    $("#profile_confirm_password").keydown(function () {
        $("#profile_alert").addClass("d-none");

        $("#profile_password").removeClass("is-invalid");
        $("#profile_confirm_password").removeClass("is-invalid");
    })

    $("#profile_form").submit(function () {
        const first_name = $("#profile_first_name").val();
        const middle_name = $("#profile_middle_name").val();
        const last_name = $("#profile_last_name").val();
        const birthday = $("#profile_birthday").val();
        const email = $("#profile_email").val();
        const mobile_number = $("#profile_mobile_number").val();
        const address = $("#profile_address").val();
        const username = $("#profile_username").val();
        const password = $("#profile_password").val();
        const confirm_password = $("#profile_confirm_password").val();
        const image = $("#profile_image").prop("files")[0];

        const user_id = $("#profile_user_id").val();
        const old_email = $("#profile_old_email").val();
        const old_username = $("#profile_old_username").val();
        const old_password = $("#profile_old_password").val();
        const old_image = $("#profile_old_image").val();

        $("#profile_alert").addClass("d-none");

        is_loading(true, "profile");

        if (password != confirm_password) {
            $("#profile_alert").text("Passwords do not match!");
            $("#profile_alert").removeClass("d-none");
            8
            $("#profile_password").addClass("is-invalid");
            $("#profile_confirm_password").addClass("is-invalid");

            is_loading(false, "profile");
        } else {
            var formData = new FormData();

            formData.append('first_name', first_name);
            formData.append('middle_name', middle_name);
            formData.append('last_name', last_name);
            formData.append('birthday', birthday);
            formData.append('email', email);
            formData.append('mobile_number', mobile_number);
            formData.append('address', address);
            formData.append('username', username);
            formData.append('password', password);
            formData.append('image', image);

            formData.append('user_id', user_id);
            formData.append('old_email', old_email);
            formData.append('old_username', old_username);
            formData.append('old_password', old_password);
            formData.append('old_image', old_image);

            formData.append('action', 'update_profile');

            $.ajax({
                url: 'server',
                data: formData,
                type: 'POST',
                dataType: 'JSON',
                processData: false,
                contentType: false,
                success: function (response) {
                    const error_username = response.message.is_error_username;
                    const error_email = response.message.is_error_email;

                    if (!error_username && !error_email) {
                        location.reload();
                    } else {
                        if (error_username) {
                            $("#error_profile_username").removeClass("d-none");
                            $("#profile_username").addClass("is-invalid");

                            $("#profile_username").focus();
                        }

                        if (error_email) {
                            $("#error_profile_email").removeClass("d-none");
                            $("#profile_email").addClass("is-invalid");

                            $("#profile_email").focus();
                        }

                        is_loading(false, "profile");
                    }
                },
                error: function (_, _, error) {
                    console.error(error);
                }
            });
        }
    })

    $(document).on("click", ".view_product", function () {
        const id = $(this).attr("product_id");

        is_loading(true, "product_details");

        $("#product_details_modal").modal("show");

        var formData = new FormData();

        formData.append('id', id);
        formData.append('action', 'get_product_data');

        $.ajax({
            url: 'server',
            data: formData,
            type: 'POST',
            dataType: 'JSON',
            processData: false,
            contentType: false,
            success: function (response) {
                const product_data = response.message;

                $("#product_details_image").attr("src", "uploads/products/" + product_data.image);
                $("#product_details_name").html(product_data.name);
                $("#product_details_category").html(product_data.category);
                $("#product_details_price").html(parseFloat(product_data.price).toFixed(2));

                is_loading(false, "product_details");
            },
            error: function (_, _, error) {
                console.error(error);
            }
        });
    })

    $(document).on("click", ".add_to_cart", function () {
        const customer_id = user_id;
        const product_id = $(this).attr("product_id");

        if (customer_id) {
            showLoadingOverlay();

            var formData = new FormData();

            formData.append('product_id', product_id);
            formData.append('user_id', customer_id);

            formData.append('action', 'add_to_cart');

            $.ajax({
                url: 'server',
                data: formData,
                type: 'POST',
                dataType: 'JSON',
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.success) {
                        cart = response.message.cart;

                        $("#cart").removeClass("d-none");
                        $("#cart").text(cart);

                        hideLoadingOverlay();

                        setTimeout(function () {
                            Swal.fire({
                                title: "Success",
                                text: "Successfully added to your shopping cart.",
                                icon: "success"
                            });
                        }, 300);
                    }
                },
                error: function (_, _, error) {
                    console.error(error);
                }
            });
        } else {
            Swal.fire({
                title: "Oops...",
                text: "You need to login first!",
                icon: "error"
            });
        }
    })

    $('#order_table thead input[type="checkbox"]').on('change', function () {
        var isChecked = $(this).is(':checked');

        $('#order_table tbody input[type="checkbox"]').prop('checked', isChecked);

        var selected_items = $('#order_table tbody input[type="checkbox"]:checked').length;

        if (selected_items > 0) {
            if (selected_items > 1) {
                $("#place_order").html('<i class="fa fa-shopping-cart mr-1"></i> Place Orders');
                $("#delete_order").html('<i class="fa fa-trash mr-1"></i> Delete Orders');
            } else {
                $("#place_order").html('<i class="fa fa-shopping-cart mr-1"></i> Place Order');
                $("#delete_order").html('<i class="fa fa-trash mr-1"></i> Delete Order');
            }

            $("#place_order").removeClass("d-none");
            $("#delete_order").removeClass("d-none");
        } else {
            $("#place_order").addClass("d-none");
            $("#delete_order").addClass("d-none");
        }
    })

    $('#order_table tbody input[type="checkbox"]').on('change', function () {
        var allChecked = $('#order_table tbody input[type="checkbox"]').length === $('#order_table tbody input[type="checkbox"]:checked').length;

        $('#order_table thead input[type="checkbox"]').prop('checked', allChecked);

        var selected_items = $('#order_table tbody input[type="checkbox"]:checked').length;

        if (selected_items > 0) {
            if (selected_items > 1) {
                $("#place_order").html('<i class="fa fa-shopping-cart mr-1"></i> Place Orders');
                $("#delete_order").html('<i class="fa fa-trash mr-1"></i> Delete Orders');
            } else {
                $("#place_order").html('<i class="fa fa-shopping-cart mr-1"></i> Place Order');
                $("#delete_order").html('<i class="fa fa-trash mr-1"></i> Delete Order');
            }

            $("#place_order").removeClass("d-none");
            $("#delete_order").removeClass("d-none");
        } else {
            $("#place_order").addClass("d-none");
            $("#delete_order").addClass("d-none");
        }
    })

    $("#place_order").click(function () {
        $("#order_summary_modal").modal("show");

        is_loading(true, "order_summary");

        let selectedItems = getCheckedItems();
        let grand_total = 0;

        let receiptHTML = `
            <div class="receipt-container p-3">
                <div class="receipt-header text-center mb-3">
                    <h4>Order Receipt</h4>
                    <p>Date: ${new Date().toLocaleDateString()}</p>
                </div>
                <div class="receipt-body">
                    <ul class="list-group">
        `;

        let ajaxCalls = [];
        let order_ids = [];

        selectedItems.forEach((item) => {
            const order_id = item.order_id;

            order_ids.push(order_id);

            var formData = new FormData();

            formData.append('id', order_id);
            formData.append('action', 'get_order_data_with_product_name');

            let ajaxCall = $.ajax({
                url: 'server',
                data: formData,
                type: 'POST',
                dataType: 'JSON',
                processData: false,
                contentType: false,
                success: function (response) {
                    const order_data = response.message;
                    const product_name = order_data.product_name;
                    const quantity = order_data.quantity;
                    const total_price = order_data.total_price;

                    grand_total = grand_total + total_price;

                    receiptHTML += `
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <strong>${product_name}</strong>
                                <p class="mb-0">Quantity: ${quantity}</p>
                            </div>
                            <span>₱${total_price.toFixed(2)}</span>
                        </li>
                    `;
                },
                error: function (_, _, error) {
                    console.error(error);
                },
            });

            ajaxCalls.push(ajaxCall);
        });

        $.when(...ajaxCalls).done(function () {
            receiptHTML += `
                    </ul>
                </div>
                <div class="receipt-footer mt-3 text-right">
                    <h5>Total: 
                        <span>₱${grand_total.toFixed(2)}</span>
                    </h5>
                </div>
            </div>
            
            <small class="text-muted"><b>Information:</b> Discounts will be applied after the seller approves the order.</small>
            `;

            $("#orderSummaryContent").html(receiptHTML);

            $("#order_summary_order_ids").val(order_ids);

            is_loading(false, "order_summary");
        });
    })

    $("#delete_order").click(function () {
        let selectedItems = getCheckedItems();
        let orderIds = selectedItems.map(item => item.order_id);

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                var formData = new FormData();

                formData.append('action', 'delete_orders');
                formData.append('order_ids', JSON.stringify(orderIds));

                $.ajax({
                    url: '../server',
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    dataType: 'JSON',
                    success: function (response) {
                        if (response.success) {
                            location.reload();
                        }
                    },
                    error: function (_, _, error) {
                        console.error("Error: ", error);
                    }
                });
            }
        });
    })

    $("#order_summary_form").submit(function () {
        const order_ids = $("#order_summary_order_ids").val();

        is_loading(true, "order_summary");

        var formData = new FormData();

        formData.append('order_ids', order_ids);
        formData.append('action', 'place_orders');

        $.ajax({
            url: 'server',
            data: formData,
            type: 'POST',
            dataType: 'JSON',
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.success) {
                    location.reload();
                }
            },
            error: function (_, _, error) {
                console.error(error);
            }
        });
    })

    $('#placed_order_table thead input[type="checkbox"]').on('change', function () {
        var isChecked = $(this).is(':checked');

        $('#placed_order_table tbody input[type="checkbox"]').prop('checked', isChecked);

        var selected_items = $('#placed_order_table tbody input[type="checkbox"]:checked').length;

        if (selected_items > 0) {
            if (selected_items > 1) {
                $("#cancel_order").html('<i class="fa fa-trash mr-1"></i> Cancel Orders');
            } else {
                $("#cancel_order").html('<i class="fa fa-trash mr-1"></i> Cancel Order');
            }

            $("#cancel_order").removeClass("d-none");
        } else {
            $("#cancel_order").addClass("d-none");
        }
    })

    $('#placed_order_table tbody input[type="checkbox"]').on('change', function () {
        var allChecked = $('#placed_order_table tbody input[type="checkbox"]').length === $('#placed_order_table tbody input[type="checkbox"]:checked').length;

        $('#placed_order_table thead input[type="checkbox"]').prop('checked', allChecked);

        var selected_items = $('#placed_order_table tbody input[type="checkbox"]:checked').length;

        if (selected_items > 0) {
            if (selected_items > 1) {
                $("#cancel_order").html('<i class="fa fa-trash mr-1"></i> Cancel Orders');
            } else {
                $("#cancel_order").html('<i class="fa fa-trash mr-1"></i> Cancel Order');
            }

            $("#cancel_order").removeClass("d-none");
        } else {
            $("#cancel_order").addClass("d-none");
        }
    })

    $("#cancel_order").click(function () {
        let selectedItems = getCheckedPlacedItems();
        let orderIds = selectedItems.map(item => item.order_id);

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, cancel it!"
        }).then((result) => {
            if (result.isConfirmed) {
                var formData = new FormData();

                formData.append('action', 'cancel_orders');
                formData.append('order_ids', JSON.stringify(orderIds));

                $.ajax({
                    url: '../server',
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    dataType: 'JSON',
                    success: function (response) {
                        if (response.success) {
                            location.reload();
                        }
                    },
                    error: function (_, _, error) {
                        console.error("Error: ", error);
                    }
                });
            }
        });
    })

    $("#chatButton").click(function () {
        markAsRead(parseInt(user_id));

        is_chatbox_open = true;

        $("#chatbox").css("display", "flex");
        $("#chatButton").hide();

        displayConversation(parseInt(user_id));
        pollForNewMessages(parseInt(user_id));
    })

    $("#closeChatbox").click(function () {
        is_chatbox_open = false;

        $("#chatbox").css("display", "none");
        $("#chatButton").show();
    })

    $('#sendMessage').on('click', function () {
        const userMessage = $('#userMessage').val().trim();
        const currentUserID = parseInt(user_id);

        if (userMessage) {
            $('#chatboxBody').scrollTop($('#chatboxBody')[0].scrollHeight);
            $('#userMessage').val('');

            const loadingMessageHtml = `
                <div class="user-message">
                    <p>Sending message...</p>
                </div>
            `;

            $("#chatboxBody").append(loadingMessageHtml);

            scrollToBottom();

            const formData = new FormData();

            formData.append('sender_id', currentUserID);
            formData.append('receiver_id', 1);
            formData.append('message', userMessage);
            formData.append('action', 'insert_message');

            $.ajax({
                url: 'server',
                data: formData,
                type: 'POST',
                dataType: 'JSON',
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.success) {
                        $('#userMessage').val('');
                        $('#userMessage').attr('rows', '1');
                        $('#userMessage').css('height', 'auto');

                        displayConversation(currentUserID);
                    }
                },
                error: function (_, _, error) {
                    console.error("Error occurred:", error);
                }
            });
        }
    })

    $('#userMessage').keydown(function (e) {
        if (e.which === 13) {
            if (e.shiftKey) {
                return;
            } else {
                e.preventDefault();

                $("#sendMessage").click();
                $('#userMessage').val('');
                $('#userMessage').attr('rows', '1');
                $('#userMessage').css('height', 'auto');
            }
        }

        if (e.which === 27) {
            $("#closeChatbox").click();
        }
    })

    $('#userMessage').on('input', function () {
        const textarea = $(this)[0];

        textarea.style.height = 'auto';

        const maxHeight = parseFloat(getComputedStyle(textarea).lineHeight) * 5;

        textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px';
        textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';

        const chatboxBody = $('#chatboxBody')[0];
        chatboxBody.scrollTop = chatboxBody.scrollHeight;
    })

    $('#sendImage').click(function () {
        $('#imageInput').trigger('click');
    })

    $('#imageInput').change(function (event) {
        const file = event.target.files[0];

        if (file) {
            sendImage(file);
        }
    })

    $('#userMessage').on('paste', function (event) {
        const clipboardData = event.originalEvent.clipboardData || window.clipboardData;
        const items = clipboardData.items;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.type.indexOf('image') !== -1) {
                const file = item.getAsFile();
                if (file) {
                    sendImage(file);
                }
                event.preventDefault();
                break;
            }
        }
    })

    $("#addEmoji").on("click", function () {
        const emojiPicker = $("#emojiPicker");
        emojiPicker.toggle();
    })

    $(".emoji-category").on("click", function () {
        const category = $(this).data("category");
        populateEmojiList(category);
    })

    $(document).on("click", function (e) {
        if (!$(e.target).closest("#emojiPicker").length && !$(e.target).closest("#addEmoji").length) {
            $("#emojiPicker").hide();
        }
    })

    $("#custom_order_image").change(function (event) {
        try {
            const reader = new FileReader();

            reader.onload = function (e) {
                $('#custom_order_image_display').attr('src', e.target.result);
            };

            reader.readAsDataURL(event.target.files[0]);
        } catch {
            $('#custom_order_image_display').attr('src', "uploads/products/default-item-image.png");
        }
    })

    $("#custom_order_form").submit(function () {
        const customer_id = $("#custom_order_customer_id").val();
        const name = $("#custom_order_name").val();
        const category = $("#custom_order_category").val();
        const price = 0;
        const quantity = $("#custom_order_quantity").val();
        const image = $("#custom_order_image").prop("files")[0];

        is_loading(true, "custom_order");

        var formData = new FormData();
        
        formData.append('customer_id', customer_id);
        formData.append('name', name);
        formData.append('category', category);
        formData.append('price', price);
        formData.append('quantity', quantity);
        formData.append('image', image);

        formData.append('action', 'custom_order');
        
        $.ajax({
            url: 'server',
            data: formData,
            type: 'POST',
            dataType: 'JSON',
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.success) {
                    location.reload();
                }
            },
            error: function(_, _, error) {
                console.error(error);
            }
        });
    });

    function markAsRead(currentUserID) {
        var formData = new FormData();

        formData.append('user_id', currentUserID);
        formData.append('action', 'mark_as_read');

        $.ajax({
            url: 'server',
            data: formData,
            type: 'POST',
            dataType: 'JSON',
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.success) {
                    $("#userMessage").focus();
                }
            },
            error: function (_, _, error) {
                console.error(error);
            }
        });
    }

    function populateEmojiList(category) {
        const emojiListContainer = $("#emojiList");
        emojiListContainer.empty();

        emojis[category].forEach(function (emoji) {
            const emojiSpan = $("<span style='cursor: pointer;'>").text(emoji);

            emojiSpan.on("click", function () {
                insertEmoji(emoji);
            });
            emojiListContainer.append(emojiSpan);
        });
    }

    function insertEmoji(emoji) {
        const userMessage = $("#userMessage");
        const cursorPosition = userMessage[0].selectionStart;
        const text = userMessage.val();
        userMessage.val(text.slice(0, cursorPosition) + emoji + text.slice(cursorPosition));
        userMessage.focus();
        $("#emojiPicker").hide();
    }

    function sendImage(file) {
        const userMessage = $('#userMessage').val().trim();

        const loadingMessageHtml = `
            <div class="user-message">
                <p>Uploading image...</p>
            </div>
        `;

        $("#chatboxBody").append(loadingMessageHtml);

        scrollToBottom();

        var formData = new FormData();

        formData.append('sender_id', parseInt(user_id));
        formData.append('receiver_id', 1);
        formData.append('message', userMessage);
        formData.append('action', 'insert_message');
        formData.append('image', file);

        $.ajax({
            url: 'server',
            type: 'POST',
            data: formData,
            dataType: 'JSON',
            processData: false,
            contentType: false,
            success: function (_) {
                displayConversation(parseInt(user_id));

                $('#userMessage').val('');
            },
            error: function (_, _, error) {
                console.error("Error occurred while sending the image:", error);
            }
        });
    }

    function scrollToBottom() {
        const chatboxBody = $('#chatboxBody')[0];

        chatboxBody.scrollTop = chatboxBody.scrollHeight;
    }

    function toggleInspectRestriction(enable) {
        if (enable) {
            $(document).on("contextmenu", function (e) {
                e.preventDefault();
            });

            $(document).on("keydown", function (e) {
                if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && e.keyCode === 73) || (e.ctrlKey && e.shiftKey && e.keyCode === 74) || (e.ctrlKey && e.keyCode === 85)) {
                    e.preventDefault();
                }
            });

            $(document).on("keydown", secretKeyListener);
        } else {
            $(document).off("contextmenu");
            $(document).off("keydown");
            $(document).off("keydown", secretKeyListener);
        }
    }

    function secretKeyListener(e) {
        keySequence.push(e.keyCode);
        if (keySequence.length > secretKeyCombination.length) {
            keySequence.shift();
        }

        if (JSON.stringify(keySequence) === JSON.stringify(secretKeyCombination)) {
            toggleInspectRestriction(false);

            Swal.fire({
                title: "Success!",
                text: "Secret combination detected! Restrictions removed.",
                icon: "success"
            });
        }
    }

    function check_unread_messages(currentUserID) {
        setInterval(() => {
            if (!is_chatbox_open) {
                let button_html = "";

                var formData = new FormData();

                formData.append('user_id', currentUserID);
                formData.append('action', 'get_unread_count');

                $.ajax({
                    url: 'server',
                    data: formData,
                    type: 'POST',
                    dataType: 'JSON',
                    processData: false,
                    contentType: false,
                    success: function (response) {
                        if (response.success) {
                            button_html = `💬 <span class="chat-badge" id="chatBadge">` + response.message + `</span>`;
                        } else {
                            button_html = `💬`;
                        }

                        $("#chatButton").html(button_html);
                    },
                    error: function (_, _, error) {
                        console.error(error);
                    }
                });
            } else {
                markAsRead(parseInt(user_id));
            }
        }, 1000);
    }

    function displayConversation(userID) {
        $(".loading").removeClass("d-none");
        $("#userMessage").attr("readonly", true);

        var formData = new FormData();

        formData.append('id', userID);
        formData.append('action', 'get_conversation_data');

        $.ajax({
            url: 'server',
            data: formData,
            type: 'POST',
            dataType: 'JSON',
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.success) {
                    conversations = response.message;

                    let conversationHtml = '<div class="bot-message">Hello, how can I help you today?</div>'; // Default greeting

                    if (conversations[userID]) {
                        conversations[userID].forEach(conversation => {
                            let messageHtml = '';

                            const isCurrentUser = conversation.user_id === userID;

                            if (isImageUrl(conversation.message)) {
                                messageHtml = `<div class="${isCurrentUser ? 'user-message' : 'bot-message'} position-relative">
                                    ${isCurrentUser ? `
                                    <div class="message-options">
                                        <i class="fa fa-ellipsis-h message-ellipsis"></i>
                                        <div class="message-menu popup-balloon d-none">
                                            <ul class="list-unstyled mb-0">
                                                <li><button class="btn btn-link text-danger unsend-message" data-message-id="${conversation.id}">Unsend</button></li>
                                                <li><button class="btn btn-link text-muted no-function" disabled>Forward</button></li>
                                                <li><button class="btn btn-link text-muted no-function" disabled>Pin</button></li>
                                            </ul>
                                        </div>
                                    </div>` : ''}
                                    <img src="uploads/conversations/${conversation.message}" alt="Image" class="message-image" style="max-width: 100%; cursor: ${isCurrentUser ? 'pointer' : 'default'};">
                                </div>`;
                            } else {
                                messageHtml = `
                                    <div class="${isCurrentUser ? 'user-message' : 'bot-message'} position-relative">
                                        ${isCurrentUser ? ` 
                                        <div class="message-options">
                                            <i class="fa fa-ellipsis-h message-ellipsis"></i>
                                            <div class="message-menu popup-balloon d-none">
                                                <ul class="list-unstyled mb-0">
                                                    <li><button class="btn btn-link text-danger unsend-message" data-message-id="${conversation.id}">Unsend</button></li>
                                                    <li><button class="btn btn-link text-muted no-function" disabled>Forward</button></li>
                                                    <li><button class="btn btn-link text-muted no-function" disabled>Pin</button></li>
                                                </ul>
                                            </div>
                                        </div>` : ''}
                                        
                                        <div class="message-text" style="white-space: pre-wrap;">${conversation.message.replace(/\n/g, '<br>')}</div>
                                    </div>
                                `;

                            }

                            conversationHtml += messageHtml;
                        });
                    }

                    $('#chatboxBody').html(conversationHtml);

                    // Use setTimeout to ensure that the images (if any) are fully loaded before scrolling
                    setTimeout(function () {
                        $('#chatboxBody').scrollTop($('#chatboxBody')[0].scrollHeight);
                    }, 100); // Adding a small delay to ensure the content has loaded before scrolling

                    // Attach click event for images
                    $('.message-image').on('click', function () {
                        const imageSrc = $(this).attr('src');
                        showFullScreenImage(imageSrc);
                    });

                    // Toggle message menu on ellipsis click
                    $('.message-ellipsis').on('click', function (e) {
                        e.stopPropagation(); // Prevent click event from propagating
                        $('.message-menu').addClass('d-none'); // Close other menus
                        $(this).siblings('.message-menu').toggleClass('d-none');
                    });

                    // Close message menu when clicking outside
                    $(document).on('click', function () {
                        $('.message-menu').addClass('d-none');
                    });

                    // Unsend message
                    $('.unsend-message').on('click', function () {
                        const messageId = $(this).data('message-id');
                        deleteMessage(messageId);
                    });

                    $(".loading").addClass("d-none");
                    $("#userMessage").removeAttr("readonly");

                    is_message_clicked = true;
                }
            },
            error: function (_, _, error) {
                console.error(error);
            }
        });
    }

    function deleteMessage(messageId) {
        var formData = new FormData();

        formData.append('action', 'delete_message');
        formData.append('message_id', messageId);

        $.ajax({
            url: 'server',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'JSON',
            success: function (response) {
                if (response.success) {
                    displayConversation(parseInt(user_id));
                }
            },
            error: function (_, _, error) {
                console.error('Error deleting message:', error);
            }
        });
    }

    function showFullScreenImage(imageSrc) {
        const fullScreenContainer = $(`
            <div id="fullScreenContainer" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.9); z-index: 9999; display: flex; justify-content: center; align-items: center; overflow: hidden;"></div>
        `);

        const fullScreenImage = $(`
            <img src="${imageSrc}" style="max-width: 90%; max-height: 90%; object-fit: contain;">
        `);

        const closeButton = $(`
            <button style="position: absolute; top: 20px; right: 20px; background: rgba(255, 255, 255, 0.7); border: none; padding: 15px; cursor: pointer; font-size: 24px; border-radius: 50%; width: 50px; height: 50px; display: flex; justify-content: center; align-items: center;">
                <i class="fa fa-times"></i>
            </button>
        `);

        const downloadButton = $(`
            <a href="${imageSrc}" download style="position: absolute; bottom: 20px; right: 20px; background: rgba(255, 255, 255, 0.7); border: none; padding: 10px 15px; cursor: pointer; font-size: 18px; border-radius: 50%; text-decoration: none; color: #000; display: flex; align-items: center; justify-content: center; width: 50px; height: 50px;">
                <i class="fa fa-download"></i>
            </a>
        `);

        fullScreenContainer.append(fullScreenImage, closeButton, downloadButton);
        $('body').append(fullScreenContainer);

        closeButton.click(() => fullScreenContainer.remove());

        fullScreenContainer.click(function (e) {
            if (e.target === fullScreenContainer[0]) {
                fullScreenContainer.remove();
            }
        });
    }

    function isImageUrl(url) {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
        const fileExtension = url.split('.').pop().toLowerCase();
        return imageExtensions.includes(fileExtension);
    }

    function pollForNewMessages(userID) {
        setInterval(function () {
            var formData = new FormData();
            formData.append('id', userID);
            formData.append('action', 'get_conversation_data');

            $.ajax({
                url: 'server',
                data: formData,
                type: 'POST',
                dataType: 'JSON',
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.success) {
                        const newConversations = response.message;

                        if (newConversations[userID] && newConversations[userID].length > conversations[userID]?.length) {
                            conversations = newConversations;

                            displayConversation(userID);
                        }
                    }
                },
                error: function (_, _, error) {
                    console.error(error);
                }
            });
        }, 5000);
    }

    function getCheckedItems() {
        let checkedItems = [];

        $('#order_table tbody input[type="checkbox"]:checked').each(function () {
            let row = $(this).closest('tr');
            let order_id = row.find('td:nth-child(2)').attr("order_id");

            checkedItems.push({ order_id: order_id });
        });

        return checkedItems;
    }

    function getCheckedPlacedItems() {
        let checkedItems = [];

        $('#placed_order_table tbody input[type="checkbox"]:checked').each(function () {
            let row = $(this).closest('tr');
            let order_id = row.find('td:nth-child(2)').attr("order_id");

            checkedItems.push({ order_id: order_id });
        });

        return checkedItems;
    }

    function showLoadingOverlay() {
        $('#loading-overlay').removeClass("d-none").fadeIn();
    }

    function hideLoadingOverlay() {
        $('#loading-overlay').fadeOut();
    }

    function is_loading(state, modal_name) {
        if (typeof state !== 'boolean') {
            console.error('Expected "state" to be a boolean.');
            return;
        }

        if (typeof modal_name !== 'string') {
            console.error('Expected "modal_name" to be a string.');
            return;
        }

        if (state) {
            $(".main-form").addClass("d-none");
            $(".loading").removeClass("d-none");

            $("#" + modal_name + "_submit").attr("disabled", true);
        } else {
            $(".main-form").removeClass("d-none");
            $(".loading").addClass("d-none");

            $("#" + modal_name + "_submit").removeAttr("disabled");
        }
    }
})