jQuery(document).ready(function () {
    if (notification) {
        Swal.fire({
            title: notification.title,
            text: notification.text,
            icon: notification.icon
        });
    }

    if (page == "admin/system_updates") {
        var formData = new FormData();

        formData.append('action', 'update_system_updates');

        $.ajax({
            url: '../server',
            data: formData,
            type: 'POST',
            dataType: 'JSON',
            processData: false,
            contentType: false,
            success: function (response) {
                $("#system_updates_counter").addClass("d-none");
            },
            error: function (_, _, error) {
                console.error(error);
            }
        });
    }

    $(".datatable").DataTable({
        "paging": true,
        "lengthChange": true,
        "searching": true,
        "ordering": false,
        "info": true,
        "autoWidth": false,
        "responsive": true,
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
            url: '../server',
            data: formData,
            type: 'POST',
            dataType: 'JSON',
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.success) {
                    location.href = "/";
                }
            },
            error: function (_, _, error) {
                console.error(error);
            }
        });
    })

    $("#new_product_image").change(function (event) {
        try {
            const reader = new FileReader();

            reader.onload = function (e) {
                $('#new_product_image_preview').attr('src', e.target.result);
            };

            reader.readAsDataURL(event.target.files[0]);
        } catch {
            $('#new_product_image_preview').attr('src', "../uploads/products/default-item-image.png");
        }
    })

    $("#new_product_form").submit(function () {
        const name = $("#new_product_name").val();
        const category = $("#new_product_category").val();
        const price = $("#new_product_price").val();
        const image = $("#new_product_image").prop("files")[0];

        is_loading(true, "new_product");

        var formData = new FormData();

        formData.append('name', name);
        formData.append('category', category);
        formData.append('price', price);
        formData.append('image', image);

        formData.append('action', 'new_product');

        $.ajax({
            url: '../server',
            data: formData,
            type: 'POST',
            dataType: 'JSON',
            processData: false,
            contentType: false,
            success: function (response) {
                location.reload();
            },
            error: function (_, _, error) {
                console.error(error);
            }
        });
    })

    $("#new_system_update_form").submit(function () {
        const system_update = $("#new_system_update_system_update").val();

        is_loading(true, "new_system_update");

        var formData = new FormData();

        formData.append('system_update', system_update);

        formData.append('action', 'new_system_update');

        $.ajax({
            url: '../server',
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

    $(document).on("click", ".view_system_update", function () {
        const id = $(this).attr("system_update_id");

        $(`[system_update_id="${id}"]`).closest('tr, span').removeClass('text-bold');

        is_loading(true, "");

        $("#view_system_update_modal").modal("show");

        var formData = new FormData();

        formData.append('id', id);
        formData.append('action', 'get_system_update_data');

        $.ajax({
            url: '../server',
            data: formData,
            type: 'POST',
            dataType: 'JSON',
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.success) {
                    var formData_2 = new FormData();

                    formData_2.append('id', response.message.id);

                    formData_2.append('action', 'update_system_update');

                    $.ajax({
                        url: '../server',
                        data: formData_2,
                        type: 'POST',
                        dataType: 'JSON',
                        processData: false,
                        contentType: false,
                        success: function (response_2) {
                            const createdAt = new Date(response.message.created_at);

                            const options = {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true
                            };

                            const formattedDate = createdAt.toLocaleString('en-US', options);

                            $("#view_system_update_created_at").html(formattedDate);
                            $("#view_system_update_system_update").html(response.message.system_update);

                            is_loading(false, "");
                        },
                        error: function (_, _, error) {
                            console.error(error);
                        }
                    });
                }
            },
            error: function (_, _, error) {
                console.error(error);
            }
        });
    })

    $(".account_settings").click(function () {
        const id = user_id;

        is_loading(true, "account_settings");

        $("#account_settings_modal").modal("show");

        var formData = new FormData();

        formData.append('id', id);

        formData.append('action', 'get_user_data');

        $.ajax({
            url: '../server',
            data: formData,
            type: 'POST',
            dataType: 'JSON',
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.success) {
                    const user_data = response.message;

                    $("#account_settings_image_display").attr("src", "../uploads/users/" + user_data.image);
                    $("#account_settings_name").val(user_data.name);
                    $("#account_settings_username").val(user_data.username);

                    $("#account_settings_id").val(user_data.id);
                    $("#account_settings_old_password").val(user_data.password);
                    $("#account_settings_old_image").val(user_data.image);

                    is_loading(false, "account_settings");
                }
            },
            error: function (_, _, error) {
                console.error(error);
            }
        });
    })

    $("#account_settings_image").change(function (event) {
        try {
            const reader = new FileReader();

            reader.onload = function (e) {
                $('#account_settings_image_display').attr('src', e.target.result);
            };

            reader.readAsDataURL(event.target.files[0]);
        } catch {
            $('#account_settings_image_display').attr('src', "../uploads/users/" + $("#account_settings_old_image").val());
        }
    })

    $("#account_settings_username").keydown(function () {
        $("#account_settings_username").removeClass("is-invalid");
        $("#error_account_settings_username").addClass("d-none");
    })

    $("#account_settings_password").keydown(function () {
        $("#account_settings_password").removeClass("is-invalid");
        $("#account_settings_confirm_password").removeClass("is-invalid");

        $("#error_account_settings_password").addClass("d-none");
    })

    $("#account_settings_confirm_password").keydown(function () {
        $("#account_settings_password").removeClass("is-invalid");
        $("#account_settings_confirm_password").removeClass("is-invalid");

        $("#error_account_settings_password").addClass("d-none");
    })

    $("#account_settings_form").submit(function () {
        const image = $("#account_settings_image").prop("files")[0];
        const name = $("#account_settings_name").val();
        const username = $("#account_settings_username").val();
        const password = $("#account_settings_password").val();
        const confirm_password = $("#account_settings_confirm_password").val();

        const id = $("#account_settings_id").val();
        const old_password = $("#account_settings_old_password").val();
        const old_image = $("#account_settings_old_image").val();

        if (password != confirm_password) {
            $("#error_account_settings_password").removeClass("d-none");

            $("#account_settings_password").addClass("is-invalid");
            $("#account_settings_confirm_password").addClass("is-invalid");
        } else {
            is_loading(true, "account_settings");

            var formData = new FormData();

            formData.append('image', image);
            formData.append('name', name);
            formData.append('username', username);
            formData.append('password', password);

            formData.append('id', id);
            formData.append('old_password', old_password);
            formData.append('old_image', old_image);

            formData.append('action', 'update_user_account');

            $.ajax({
                url: '../server',
                data: formData,
                type: 'POST',
                dataType: 'JSON',
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.success) {
                        location.reload();
                    } else {
                        $("#error_account_settings_username").removeClass("d-none");

                        $("#account_settings_username").addClass("is-invalid");

                        is_loading(false, "account_settings");
                    }
                },
                error: function (_, _, error) {
                    console.error(error);
                }
            });
        }
    })

    $(document).on("click", ".delete_product", function () {
        const id = $(this).attr("product_id");

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

                formData.append('id', id);

                formData.append('action', 'delete_product');

                $.ajax({
                    url: '../server',
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
            }
        });

    })

    $(document).on("click", ".update_product", function () {
        const id = $(this).attr("product_id");

        is_loading(true, "update_product");

        $("#update_product_modal").modal("show");

        var formData = new FormData();

        formData.append('id', id);

        formData.append('action', 'get_product_data');

        $.ajax({
            url: '../server',
            data: formData,
            type: 'POST',
            dataType: 'JSON',
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.success) {
                    const product_data = response.message;

                    $("#update_product_image_preview").attr("src", "../uploads/products/" + product_data.image);
                    $("#update_product_name").val(product_data.name);
                    $("#update_product_category").val(product_data.category);
                    $("#update_product_price").val(product_data.price);

                    $("#update_product_id").val(product_data.id);
                    $("#update_product_old_image").val(product_data.image);

                    is_loading(false, "update_product");

                    $("#update_product_modal").modal("show");
                }
            },
            error: function (_, _, error) {
                console.error(error);
            }
        });
    })

    $("#update_product_image").change(function (event) {
        try {
            const reader = new FileReader();

            reader.onload = function (e) {
                $('#update_product_image_preview').attr('src', e.target.result);
            };

            reader.readAsDataURL(event.target.files[0]);
        } catch {
            $('#update_product_image_preview').attr('src', "../uploads/products/" + $("#update_product_old_image").val());
        }
    })

    $("#update_product_form").submit(function () {
        const name = $("#update_product_name").val();
        const category = $("#update_product_category").val();
        const price = $("#update_product_price").val();
        const image = $("#update_product_image").prop("files")[0];

        const id = $("#update_product_id").val();
        const old_image = $("#update_product_old_image").val();

        is_loading(true, "update_product");

        var formData = new FormData();

        formData.append('name', name);
        formData.append('category', category);
        formData.append('price', price);
        formData.append('image', image);

        formData.append('id', id);
        formData.append('old_image', old_image);

        formData.append('action', 'update_product');

        $.ajax({
            url: '../server',
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