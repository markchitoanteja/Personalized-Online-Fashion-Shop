<?php
$tracking_number = get("tracking_number") ? get("tracking_number") : null;
?>

<!-- ***** Main Banner Area Start ***** -->
<div class="page-heading about-page-heading" id="top">
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
                <div class="inner-content">
                    <h2>Order Tracking</h2>
                    <span>Keep an eye on all your orders, whether completed or pending, in one simple location.</span>
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
            <div class="col-lg-7">
                <!-- Space -->
            </div>
            <div class="col-lg-5">
                <form action="javascript:void(0)" id="order_tracking_form">
                    <div class="d-flex align-items-center">
                        <input type="text" class="form-control mr-2" id="order_tracking_tracking_number" value="<?= $tracking_number ?>" placeholder="Enter Tracking Number" required>
                        <button type="submit" class="btn btn-primary text-nowrap" id="order_tracking_submit"><i class="fa fa-search mr-1"></i> Track Order</button>
                    </div>
                </form>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-body">
                        <?php if ($tracking_number): ?>
                            <?php
                            $database = new Database();

                            $sql = "SELECT * FROM track_orders WHERE tracking_number='$tracking_number'";
                            $order_tracking_details = $database->query($sql);
                            ?>
                            <?php if ($order_tracking_details): ?>
                                <?php
                                $sql_2 = "SELECT orders.*, users.name AS user_name, customers.mobile_number, customers.address, products.name AS product_name FROM orders LEFT JOIN users ON orders.user_id = users.id LEFT JOIN customers ON orders.user_id = customers.user_id LEFT JOIN products ON orders.product_id = products.id WHERE orders.tracking_number = '$tracking_number'";
                                $order_details = $database->query($sql_2);

                                $total_items = 0;
                                $total_price = 0;
                                ?>
                                <!-- Order Details Section -->
                                <div class="order-details mb-4">
                                    <h2 class="text-center text-primary mb-4">Order Details</h2>
                                    <div class="details-container">
                                        <div class="row mb-3">
                                            <div class="col-6">
                                                <strong>Tracking Number:</strong>
                                            </div>
                                            <div class="col-6 text-end">
                                                <span><?= $order_details[0]["tracking_number"] ?></span>
                                            </div>
                                        </div>
                                        <div class="row mb-3">
                                            <div class="col-6">
                                                <strong>Recipient:</strong>
                                            </div>
                                            <div class="col-6 text-end">
                                                <span><?= $order_details[0]["user_name"] ?></span>
                                            </div>
                                        </div>
                                        <div class="row mb-3">
                                            <div class="col-6">
                                                <strong>Shipping Address:</strong>
                                            </div>
                                            <div class="col-6 text-end">
                                                <span><?= $order_details[0]["address"] ?></span>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-6">
                                                <strong>Mobile Number:</strong>
                                            </div>
                                            <div class="col-6 text-end">
                                                <span><?= $order_details[0]["mobile_number"] ?></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Items Section -->
                                <div class="items-section mb-4">
                                    <h2 class="text-center text-primary mb-4">Items to Be Delivered</h2>
                                    <div class="items-container">
                                        <!-- Table Header -->
                                        <div class="row mb-3">
                                            <div class="col-6"><strong>Item Name</strong></div>
                                            <div class="col-3 text-center"><strong>Quantity</strong></div>
                                            <div class="col-3 text-end"><strong>Price</strong></div>
                                        </div>
                                        <!-- Table Items -->
                                        <?php foreach ($order_details as $order_detail): ?>
                                            <?php
                                            $total_items = $total_items + intval($order_detail["quantity"]);
                                            $total_price = $total_price + floatval($order_detail["total_price"]);
                                            ?>
                                            <div class="row mb-2">
                                                <div class="col-6">
                                                    <a href="javascript:void(0)" class="view_product" product_id="<?= $order_detail["product_id"] ?>"><?= $order_detail["product_name"] ?></a>
                                                </div>
                                                <div class="col-3 text-center"><?= $order_detail["quantity"] ?></div>
                                                <div class="col-3 text-end"><span class="fas fa-peso-sign"></span><?= number_format($order_detail["total_price"], 2) ?></div>
                                            </div>
                                        <?php endforeach ?>
                                        <!-- Table Footer -->
                                        <div class="row mt-3">
                                            <div class="col-6"><strong>Total</strong></div>
                                            <div class="col-3 text-center"><strong><?= $total_items ?></strong></div>
                                            <div class="col-3 text-end"><strong><span class="fas fa-peso-sign"></span><?= number_format($total_price, 2) ?></strong></div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Timeline Tracking Section -->
                                <div class="tracking-section">
                                    <h2 class="text-center text-primary mb-4">Parcel Tracking Details</h2>
                                    <div class="timeline-container">
                                        <?php foreach ($order_tracking_details as $order_tracking_detail): ?>
                                            <?php
                                            // Variables to hold Bootstrap color, Font Awesome icon, and status text
                                            $badgeColor = 'bg-secondary';  // Default value
                                            $icon = '<i class="fa fa-question-circle"></i>';  // Default value
                                            $statusText = 'Unknown Status';  // Default value

                                            // Switch statement for different statuses
                                            switch ($order_tracking_detail["status"]) {
                                                case "Processed":
                                                    $badgeColor = "bg-primary";
                                                    $icon = '<i class="fa fa-cogs"></i>';
                                                    $statusText = "Processed";
                                                    break;

                                                case "Delivery Preparation":
                                                    $badgeColor = "bg-info";
                                                    $icon = '<i class="fa fa-archive"></i>';
                                                    $statusText = "Delivery Preparation";
                                                    break;

                                                case "In Transit":
                                                    $badgeColor = "bg-warning";
                                                    $icon = '<i class="fa fa-truck"></i>';
                                                    $statusText = "In Transit";
                                                    break;

                                                case "Out for Delivery":
                                                    $badgeColor = "bg-warning";
                                                    $icon = '<i class="fa fa-motorcycle"></i>';
                                                    $statusText = "Out for Delivery";
                                                    break;

                                                case "Delivered":
                                                    $badgeColor = "bg-success";
                                                    $icon = '<i class="fa fa-check-circle"></i>';
                                                    $statusText = "Delivered";
                                                    break;

                                                case "Completed":
                                                    $badgeColor = "bg-success";
                                                    $icon = '<i class="fa fa-check"></i>';
                                                    $statusText = "Completed";
                                                    break;

                                                case "Rejected":
                                                    $badgeColor = "bg-danger";
                                                    $icon = '<i class="fa fa-times-circle"></i>';
                                                    $statusText = "Rejected";
                                                    break;

                                                default:
                                                    $badgeColor = "bg-secondary";
                                                    $icon = '<i class="fa fa-question-circle"></i>';
                                                    $statusText = "Unknown Status";
                                                    break;
                                            }

                                            ?>

                                            <div class="timeline-item">
                                                <div class="timeline-icon <?= $badgeColor ?> text-white">
                                                    <?= $icon ?>
                                                </div>
                                                <div class="timeline-content">
                                                    <h5 class="mb-1"><?= date("F j, Y g:i A", strtotime($order_tracking_detail["created_at"])) ?></h5>
                                                    <h6 class="mb-0 <?= $badgeColor == 'bg-success' ? 'text-success' : ($badgeColor == 'bg-danger' ? 'text-danger' : 'text-muted') ?>"><?= $statusText ?></h6>
                                                    <p class="text-muted"><?= $order_tracking_detail["description"] ?></p>
                                                </div>
                                            </div>
                                        <?php endforeach ?>
                                    </div>
                                </div>
                            <?php else: ?>
                                <div class="py-5 text-center" id="order_tracking_no_data">
                                    <h1 class="text-muted">No Available Data</h1>
                                </div>
                            <?php endif ?>
                        <?php else: ?>
                            <div class="py-5 text-center" id="order_tracking_no_data">
                                <h1 class="text-muted">Please Enter a Tracking Number</h1>
                            </div>
                        <?php endif ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- ***** Main Area Ends ***** -->

<?php include_once "../app/views/components/order_summary_modal.php" ?>
<?php include_once "../app/views/components/product_details_modal.php" ?>