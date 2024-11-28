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