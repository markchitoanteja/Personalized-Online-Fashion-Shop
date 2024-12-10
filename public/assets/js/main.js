jQuery(document).ready(function () {
    const url = new URL(window.location.href);

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
                    location.reload();
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

        $("#login_alert").addClass("d-none");

        is_loading(true, "login");

        var formData = new FormData();

        formData.append('username', username);
        formData.append('password', password);

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