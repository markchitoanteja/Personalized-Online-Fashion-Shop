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
                if (response.success) {
                    $("#system_updates_counter").addClass("d-none");
                    $('.system_updates').removeClass('text-bold');
                }
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

        $(".main-form").addClass("d-none");
        $(".loading").removeClass("d-none");

        $("#new_product_submit").attr("disabled", true);

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

                    $("#view_system_update_created_at").text(formattedDate);
                    $("#view_system_update_system_update").text(response.message.system_update);

                    is_loading(false, "");
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