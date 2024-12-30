<!-- ***** Main Banner Area Start ***** -->
<div class="page-heading about-page-heading" id="top">
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
                <div class="inner-content">
                    <h2>My Orders</h2>
                    <span>Review the items you've added, adjust quantities, or proceed to checkout for a seamless shopping experience.</span>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- ***** Main Banner Area End ***** -->

<!-- ***** Main Area Starts ***** -->
<div class="about-us">
    <div class="container">
        <div class="row mb-2">
            <div class="col-lg-8">
                <!-- Space -->
            </div>
            <div class="col-lg-4">
                <button class="btn btn-danger w-100 d-none" id="cancel_order"><i class="fa fa-trash mr-1"></i> Cancel Order</button>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-body">
                        <div class="table-responsive">
                            <?php
                            $database = new Database;
                            $sql = "SELECT * FROM orders WHERE status!='CART' AND user_id='" . session("user_id") . "'";
                            $orders = $database->query($sql);

                            function generate_order_id($order_id)
                            {
                                return str_pad($order_id, 5, '0', STR_PAD_LEFT);
                            }
                            ?>
                            <table class="table table-bordered datatable" id="placed_order_table">
                                <thead>
                                    <tr>
                                        <?php if ($orders): ?>
                                            <th class="text-center"><input type="checkbox" style="cursor: pointer;"></th>
                                        <?php endif ?>
                                        <th class="text-center">Order ID</th>
                                        <th class="text-center">Product Name</th>
                                        <th class="text-center">Quantity</th>
                                        <th class="text-center">Total Price</th>
                                        <th class="text-center">Status</th>
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
                                                case "Cancelled":
                                                    $status_color = "text-danger";
                                                    break;
                                                default:
                                                    $status_color = "text-muted";
                                                    break;
                                            }

                                            if ($order["request_cancel"]) {
                                                $status_color = "text-warning";
                                            }
                                            ?>
                                            <tr>
                                                <td class="text-center"><input type="<?= $order["request_cancel"] ? "hidden" : "checkbox" ?>" style="cursor: pointer;"></td>
                                                <td class="text-center" order_id="<?= $order["id"] ?>">#<?= generate_order_id($order["id"]) ?></td>
                                                <td class="text-center"><?= $database->select_one("products", ["id" => $order["product_id"]])["name"] ?></td>
                                                <td class="text-center"><?= $order["quantity"] ?> Item<?= $order["quantity"] > 1 ? "s" : null ?></td>
                                                <td class="text-center">₱<?= number_format($order["total_price"], 2) ?></td>
                                                <td class="text-center <?= $status_color ?>"><?= !$order["request_cancel"] ? $order["status"] : "Cancel Pending" ?></td>
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
</div>
<!-- ***** Main Area Ends ***** -->

<?php include_once "../app/views/components/order_summary_modal.php" ?>