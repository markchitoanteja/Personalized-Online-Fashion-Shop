jQuery(document).ready(function () {
    if (notification) {
        Swal.fire({
            title: notification.title,
            text: notification.text,
            icon: notification.icon
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

    $(".print_order").click(function () {
        const order_id = $(this).attr("order_id");

        window.open("print_order?order_id=" + order_id, "_blank");
    })
})  