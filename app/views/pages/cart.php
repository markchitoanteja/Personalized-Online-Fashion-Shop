<!-- ***** Main Banner Area Start ***** -->
<div class="page-heading about-page-heading" id="top">
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
                <div class="inner-content">
                    <h2>My Shopping Cart</h2>
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
            <div class="col-lg-6">
                <!-- Space -->
            </div>
            <div class="col-lg-6 d-flex flex-column flex-lg-row justify-content-between align-items-center">
                <button class="btn btn-primary w-100 mb-2 mb-lg-0 mr-0 mr-lg-2 d-none" id="place_order"><i class="fa fa-shopping-cart mr-1"></i> Place Order</button>
                <button class="btn btn-danger w-100 d-none" id="delete_order"><i class="fa fa-trash mr-1"></i> Delete Order</button>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-bordered datatable" id="order_table">
                                <thead>
                                    <tr>
                                        <th class="text-center"><input type="checkbox" style="cursor: pointer;"></th>
                                        <th class="text-center">Order ID</th>
                                        <th class="text-center">Product Name</th>
                                        <th class="text-center">Quantity</th>
                                        <th class="text-center">Total Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php
                                    $database = new Database;
                                    $cart_items = $database->select_many("orders", ["status" => "Cart", "user_id" => session("user_id")], "AND");

                                    function generate_order_id($order_id)
                                    {
                                        return str_pad($order_id, 5, '0', STR_PAD_LEFT);
                                    }
                                    ?>

                                    <?php if ($cart_items): ?>
                                        <?php foreach ($cart_items as $cart_item): ?>
                                            <tr>
                                                <td class="text-center"><input type="checkbox" style="cursor: pointer;"></td>
                                                <td class="text-center" order_id="<?= $cart_item["id"] ?>">#<?= generate_order_id($cart_item["id"]) ?></td>
                                                <td class="text-center"><?= $database->select_one("products", ["id" => $cart_item["product_id"]])["name"] ?></td>
                                                <td class="text-center"><?= $cart_item["quantity"] ?> Item<?= $cart_item["quantity"] > 1 ? "s" : null ?></td>
                                                <td class="text-center">₱<?= number_format($cart_item["total_price"], 2) ?></td>
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