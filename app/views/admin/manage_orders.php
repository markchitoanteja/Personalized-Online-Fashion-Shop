<?php include_once "../app/views/admin/templates/header.php" ?>

<div class="content-wrapper">
    <section class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1>Manage Orders</h1>
                </div>
            </div>
        </div>
    </section>

    <section class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="table-responsive">
                                <?php
                                $database = new Database;
                                $sql = "SELECT * FROM orders WHERE status != 'Cart' ORDER BY id DESC";
                                $orders = $database->query($sql);

                                function generate_order_id($order_id)
                                {
                                    return str_pad($order_id, 5, '0', STR_PAD_LEFT);
                                }
                                ?>
                                <table class="table table-bordered datatable">
                                    <thead>
                                        <tr>
                                            <th class="text-center">Order ID</th>
                                            <th>Customer Name</th>
                                            <th>Product Name</th>
                                            <th>Quantity</th>
                                            <th>Total Price</th>
                                            <th>Order Status</th>
                                            <th class="text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php if ($orders): ?>
                                            <?php foreach ($orders as $order): ?>
                                                <?php
                                                switch ($order["status"]) {
                                                    case "Placed":
                                                        $status_color = "text-primary";
                                                        break;
                                                    case "Completed":
                                                        $status_color = "text-success";
                                                        break;
                                                    case "Cancelled":
                                                        $status_color = "text-danger";
                                                        break;
                                                    default:
                                                        $status_color = "text-info";
                                                        break;
                                                }

                                                $status = $order["request_cancel"] ? "Cancel Requested" : $order["status"];
                                                $status_color = $order["request_cancel"] ? "text-warning" : $status_color;
                                                ?>
                                                <tr>
                                                    <td class="text-center">#<?= generate_order_id($order["id"]) ?></td>
                                                    <td><?= $database->select_one("users", ["id" => $order["user_id"]])["name"] ?></td>
                                                    <td><?= $database->select_one("products", ["id" => $order["product_id"]])["name"] ?></td>
                                                    <td><?= $order["quantity"] ?> Item<?= $order["quantity"] > 1 ? "s" : null ?></td>
                                                    <td><i class="fas fa-peso-sign"></i><?= number_format($order["total_price"], 2) ?></td>
                                                    <td class="<?= $status_color ?>"><?= $status ?></td>
                                                    <td class="text-center">
                                                        <?php if ($status == "Placed" || $status == "Cancel Requested"): ?>
                                                            <i quantity="<?= $order["quantity"] ?>" is_custom_order="<?= $order["is_custom_order"] ?>" order_id="<?= $order["id"] ?>" class="fas fa-thumbs-up text-primary mr-2 <?= $order["request_cancel"] ? "approve_cancel" : "approve_order" ?>" title="Approve <?= $order["request_cancel"] ? "Cancel" : "Order" ?>" role="button"></i>
                                                            <i order_id="<?= $order["id"] ?>" class="fas fa-thumbs-down text-danger mr-2 <?= $order["request_cancel"] ? "reject_cancel" : "reject_order" ?>" title="Reject <?= $order["request_cancel"] ? "Cancel" : "Order" ?>" role="button"></i>
                                                        <?php endif ?>
                                                        
                                                        <i is_custom_order="<?= $order["is_custom_order"] ?>" product_id="<?= $order["product_id"] ?>" class="fas fa-eye text-primary view_product_details" title="View Product Details" role="button"></i>
                                                    </td>
                                                </tr>
                                            <?php endforeach ?>
                                        <?php endif ?>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>

<?php include_once "../app/views/admin/components/product_details_modal.php" ?>
<?php include_once "../app/views/admin/components/approve_custom_order_modal.php" ?>

<?php include_once "../app/views/admin/templates/footer.php" ?>