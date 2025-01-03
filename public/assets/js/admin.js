jQuery(document).ready(function () {
    var unread_message_count = 0;
    var secretKeyCombination = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    var keySequence = [];

    toggleInspectRestriction(true);

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

    if (page == "admin/customer_messages") {
        var formData = new FormData();

        formData.append('action', 'update_notification_settings');

        $.ajax({
            url: '../server',
            data: formData,
            type: 'POST',
            dataType: 'JSON',
            processData: false,
            contentType: false,
            success: function (response) {
                unread_message_count = response.message;
            },
            error: function (_, _, error) {
                console.error(error);
            }
        });
    }

    check_unread_messages();

    setInterval(() => {
        check_unread_messages();
    }, 1000);

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
            text: "You are about to delete this product!",
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

    $(".admin_reply").click(function () {
        const id = $(this).attr("conversation_id");

        $(this).closest("tr").removeClass("text-bold");

        is_loading(true, "reply");

        $("#reply_modal").modal("show");

        var formData = new FormData();

        formData.append('action', 'get_conversation_data_with_user');
        formData.append('id', id);

        $.ajax({
            url: '../server',
            data: formData,
            type: 'POST',
            dataType: 'JSON',
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.success) {
                    const conversation_data = response.message;

                    $("#reply_id").val(conversation_data.id);
                    $("#reply_receiver_id").val(conversation_data.sender_id);
                    $("#reply_name").text(conversation_data.name);
                    $("#reply_name_header").text(conversation_data.name);
                    $("#reply_created_at").text(format_date(conversation_data.created_at));

                    const basePath = "../uploads/conversations/";

                    if (conversation_data.message.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
                        $("#reply_message").html(
                            `<img src="${basePath + conversation_data.message}" alt="Conversation Image" class="img-fluid rounded">`
                        );
                    } else {
                        $("#reply_message").text(conversation_data.message);
                    }

                    is_loading(false, "reply");
                }
            },
            error: function (_, _, error) {
                console.error(error);
            }
        });
    })

    $("#reply_submit").click(function () {
        const id = $("#reply_id").val();
        const receiver_id = $("#reply_receiver_id").val();
        const message = $("#reply_message_send").val().trim();

        if (message) {
            is_loading(true, "reply");

            var formData = new FormData();

            formData.append('id', id);
            formData.append('receiver_id', receiver_id);
            formData.append('message', message);

            formData.append('action', 'reply_to_conversation');

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
        } else {
            $("#reply_message_send").addClass("is-invalid");
            $("#error_reply_message_send").removeClass("d-none");
        }
    })

    $("#reply_message_send").keydown(function () {
        $("#reply_message_send").removeClass("is-invalid");
        $("#error_reply_message_send").addClass("d-none");
    })

    $(document).on("click", ".approve_order", function () {
        const id = $(this).attr("order_id");
        const is_custom_order = $(this).attr("is_custom_order");
        const quantity = $(this).attr("quantity");

        if (is_custom_order == "0") {
            Swal.fire({
                title: "Are you sure?",
                text: "You are about to approve this order!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, approve it!"
            }).then((result) => {
                if (result.isConfirmed) {
                    var formData = new FormData();

                    formData.append('id', id);

                    formData.append('action', 'approve_order');

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
        } else {
            $("#custom_order_id").val(id);
            $("#custom_order_quantity").val(quantity);

            $("#custom_order_modal").modal("show");
        }
    })

    $(document).on("click", ".reject_order", function () {
        const id = $(this).attr("order_id");

        Swal.fire({
            title: "Are you sure?",
            text: "You are about to cancel this order!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, cancel it!"
        }).then((result) => {
            if (result.isConfirmed) {
                var formData = new FormData();

                formData.append('id', id);

                formData.append('action', 'cancel_order');

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

    $(document).on("click", ".approve_cancel", function () {
        const id = $(this).attr("order_id");

        Swal.fire({
            title: "Are you sure?",
            text: "You are about to approve this cancellation request!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, approve it!"
        }).then((result) => {
            if (result.isConfirmed) {
                var formData = new FormData();

                formData.append('id', id);

                formData.append('action', 'approve_cancel');

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

    $(document).on("click", ".reject_cancel", function () {
        const id = $(this).attr("order_id");

        Swal.fire({
            title: "Are you sure?",
            text: "You are about to reject this cancellation request!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, reject it!"
        }).then((result) => {
            if (result.isConfirmed) {
                var formData = new FormData();

                formData.append('id', id);

                formData.append('action', 'reject_cancel');

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

    $(document).on("click", ".view_product_details", function () {
        const id = $(this).attr("product_id");
        const is_custom_order = $(this).attr("is_custom_order");

        is_loading(true, "");

        $("#product_details_modal").modal("show");

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

                    $("#product_details_image").attr("src", "../uploads/products/" + product_data.image);
                    $("#product_details_name").text(product_data.name);
                    $("#product_details_category").text(product_data.category);
                    if (is_custom_order == "1") {
                        $("#product_details_price").text("Custom Order");
                        $("#product_details_peso_sign").addClass("d-none");
                    } else {
                        $("#product_details_price").text(parseFloat(product_data.price).toFixed(2));
                        $("#product_details_peso_sign").removeClass("d-none");
                    }

                    is_loading(false, "");
                }
            },
            error: function (_, _, error) {
                console.error(error);
            }
        });
    })

    $("#custom_order_form").submit(function () {
        const id = $("#custom_order_id").val();
        const quantity = $("#custom_order_quantity").val();
        const price = $("#custom_order_price").val();

        is_loading(true, "custom_order");

        var formData = new FormData();

        formData.append('id', id);
        formData.append('quantity', quantity);
        formData.append('price', price);

        formData.append('action', 'approve_custom_order');

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

    function format_date(inputDate) {
        const date = new Date(inputDate);

        if (isNaN(date.getTime())) {
            return "Invalid date";
        }

        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        };

        return date.toLocaleString('en-US', options);
    }

    function check_unread_messages() {
        var formData = new FormData();

        formData.append('action', 'check_unread_messages');

        $.ajax({
            url: '../server',
            data: formData,
            type: 'POST',
            dataType: 'JSON',
            processData: false,
            contentType: false,
            success: function (response) {
                const read_status = response.message.read_status;
                const unread_messages = response.message.unread_messages - unread_message_count;

                if (read_status == "unread") {
                    if (page == "admin/customer_messages") {
                        const message = unread_messages > 1 ? "Messages" : "Message";

                        $("#new_message_header").removeClass("d-none");

                        $("#new_message_header_text").text(unread_messages + " New " + message + " (Click to Reload Page)");
                    } else {
                        $("#new_message_badge").text(unread_messages);
                        $("#new_message_badge").removeClass("d-none");
                    }
                }
            },
            error: function (_, _, error) {
                console.error(error);
            }
        });
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