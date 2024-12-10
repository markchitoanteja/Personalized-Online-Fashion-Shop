<?php include_once "../app/views/admin/templates/header.php" ?>

<div class="content-wrapper">
    <section class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1>Manage Products</h1>
                </div>
                <div class="col-sm-6">
                    <button class="btn btn-primary float-right" data-toggle="modal" data-target="#new_product_modal"><i class="fas fa-plus mr-1"></i> New Product</button>
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
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th class="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php
                                    $database = new Database();
                                    $products = $database->select_all("products", "id", "DESC");
                                    ?>

                                    <?php if ($products): ?>
                                        <?php foreach ($products as $product): ?>
                                            <tr>
                                                <td><?= $product["name"] ?></td>
                                                <td><?= $product["category"] ?></td>
                                                <td>₱ <?= $product["price"] ?></td>
                                                <td class="text-center">
                                                    <i class="fas fa-pencil-alt text-primary mr-1 update_product" role="button" product_id="<?= $product["id"] ?>"></i>
                                                    <i class="fas fa-trash-alt text-danger delete_product" role="button" product_id="<?= $product["id"] ?>"></i>
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

<?php include_once "../app/views/admin/components/new_product_modal.php" ?>
<?php include_once "../app/views/admin/components/update_product_modal.php" ?>

<?php include_once "../app/views/admin/templates/footer.php" ?>