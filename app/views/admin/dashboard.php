<?php include_once "../app/views/admin/templates/header.php" ?>

<?php $database = new Database ?>

<div class="content-wrapper">
    <section class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1>Dashboard</h1>
                </div>
            </div>
        </div>
    </section>

    <section class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-4">
                    <div class="small-box bg-info">
                        <div class="inner">
                            <?php
                            $sql = "SELECT SUM(total_price) AS total_completed_price FROM orders WHERE status = 'Completed'";
                            $total_sales = number_format(floatval($database->query($sql)[0]["total_completed_price"]), 2);
                            ?>

                            <h3><i class="fas fa-peso-sign"></i><?= $total_sales ?></h3>
                            <p>Total Sales</p>
                        </div>
                        <div class="icon">
                            <i class="fa fa-wallet"></i>
                        </div>
                        <a href="manage_orders" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="small-box bg-success">
                        <div class="inner">
                            <h3><?= count($database->select_all("users")) ?></h3>
                            <p>Active Users</p>
                        </div>
                        <div class="icon">
                            <i class="fa fa-users"></i>
                        </div>
                        <a href="javascript:void(0)" class="small-box-footer no-function">More info <i class="fas fa-arrow-circle-right"></i></a>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="small-box bg-warning">
                        <div class="inner">
                            <h3><?= count($database->select_all("products")) ?></h3>
                            <p>Total Items</p>
                        </div>
                        <div class="icon">
                            <i class="fa fa-box-open"></i>
                        </div>
                        <a href="manage_products" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title"><i class="fa fa-history mr-1"></i> Recent Activities</h3>
                        </div>
                        <div class="card-body">
                            <table class="table table-bordered datatable">
                                <thead>
                                    <tr>
                                        <th>Date & Time</th>
                                        <th>Activity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- Data Here -->
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