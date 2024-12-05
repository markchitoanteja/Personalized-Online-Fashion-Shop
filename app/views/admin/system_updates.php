<?php include_once "../app/views/admin/templates/header.php" ?>

<div class="content-wrapper">
    <section class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1>System Updates</h1>
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
                                        <th>Date and Time</th>
                                        <th>System Update</th>
                                        <th class="text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php
                                    $database = new Database();
                                    $system_updates = $database->select_all("system_updates", "id", "DESC");
                                    ?>

                                    <?php if ($system_updates): ?>
                                        <?php foreach ($system_updates as $system_update): ?>
                                            <tr class="<?= $system_update["status"] == "unread" ? "text-bold" : null ?>">
                                                <td><?= date('F j, Y g:i A', strtotime($system_update["created_at"])) ?></td>
                                                <td><?= strlen($system_update["system_update"]) > 50 ? substr($system_update["system_update"], 0, 70) . '...' : $system_update["system_update"] ?></td>
                                                <td class="text-center">
                                                    <i class="fas fa-eye text-primary view_system_update" role="button" system_update_id="<?= $system_update["id"] ?>"></i>
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