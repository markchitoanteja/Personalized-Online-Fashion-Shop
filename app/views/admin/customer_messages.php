<?php include_once "../app/views/admin/templates/header.php" ?>

<div class="content-wrapper">
    <section class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1>Customer Messages</h1>
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
                            <table class="table table-bordered datatable">
                                <thead>
                                    <tr>
                                        <th>Date and Time</th>
                                        <th>User Name</th>
                                        <th>Message</th>
                                        <th class="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php
                                    $database = new Database();

                                    $sql = "SELECT * FROM conversations ORDER BY id DESC";
                                    $conversations = $database->query($sql);
                                    ?>

                                    <?php if ($conversations): ?>
                                        <?php foreach ($conversations as $conversation): ?>
                                            <tr class="<?= $conversation["read_status"] == "unread" && $conversation["sender_id"] != 1 ? "text-bold" : null ?>">
                                                <td><?= date('F j, Y g:i A', strtotime($conversation["created_at"])) ?></td>
                                                <td><?= $database->select_one("users", ["id" => $conversation["sender_id"]])["name"] ?></td>
                                                <td><?= $conversation["message"] ?></td>
                                                <td class="text-center">
                                                    <?php if ($conversation["sender_id"] != 1): ?>
                                                        <i title="Reply" class="fas fa-reply text-primary admin_reply" role="button" conversation_id="<?= $conversation["id"] ?>"></i>
                                                    <?php else: ?>
                                                        <small class="text-muted">No Actions</small>
                                                    <?php endif ?>
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

<?php include_once "../app/views/admin/components/reply_modal.php" ?>

<?php include_once "../app/views/admin/templates/footer.php" ?>