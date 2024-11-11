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

    $("#subscribe_form").submit(function () {
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
        const name = $("#register_name").val();
        const username = $("#register_username").val();
        const password = $("#register_password").val();
        const confirm_password = $("#register_confirm_password").val();

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

            formData.append('name', name);
            formData.append('username', username);
            formData.append('password', password);

            formData.append('action', 'register');

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
                        $("#register_alert").text(response.message);
                        $("#register_alert").removeClass("d-none");

                        $("#register_username").addClass("is-invalid");

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
        $("#register_alert").addClass("d-none");

        $("#register_username").removeClass("is-invalid");
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