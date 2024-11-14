<?php include_once "../app/views/admin/templates/header.php" ?>

<div class="content-wrapper">
    <section class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1>Manage Orders <small class="text-muted">(This are mock orders)</small></h1>
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
                            <table class="table table-bordered table-striped datatable">
                                <thead>
                                    <tr>
                                        <th>Customer Name</th>
                                        <th>Product Name</th>
                                        <th>Quantity</th>
                                        <th>Total Price</th>
                                        <th>Status</th>
                                        <th class="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php
                                    $database = new Database();
                                    $orders = $database->select_all("orders", "id", "DESC");
                                    ?>

                                    <?php if ($orders): ?>
                                        <?php foreach ($orders as $order): ?>
                                            <tr>
                                                <td><?= $database->select_one("users", ["id" => $order["user_id"]])["name"] ?></td>
                                                <td><?= $database->select_one("products", ["id" => $order["product_id"]])["name"] ?></td>
                                                <td><?= $order["quantity"] ?></td>
                                                <td>₱ <?= $order["total_price"] ?></td>
                                                <td><?= ucfirst($order["status"]) ?></td>
                                                <td class="text-center">
                                                    <i class="fas fa-print text-success mr-1 print_order" role="button" order_id="<?= $order["id"] ?>"></i>
                                                    <i class="fas fa-pencil-alt text-primary mr-1 no-function" role="button" order_id="<?= $order["id"] ?>"></i>
                                                    <i class="fas fa-trash-alt text-danger no-function" role="button" order_id="<?= $order["id"] ?>"></i>
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
    </section>
</div>

<?php include_once "../app/views/admin/templates/footer.php" ?>