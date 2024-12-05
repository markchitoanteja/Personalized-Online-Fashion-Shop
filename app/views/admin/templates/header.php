<?php
$database = new Database();

$user_data = null;

if (session("user_id")) {
    if ((session("user_type") != "developer") && (session("user_type") != "admin")) {
        $notification_message = [
            "title" => "Oops...",
            "text" => "You do not have the rights to access this page!",
            "icon" => "error",
        ];

        session("notification", $notification_message);

        redirect("/");
    } else {
        $user_data = $database->select_one("users", ["id" => session("user_id")]);
        $system_updates = $database->select_all("system_updates", "id", "DESC");

        $unread_updates = 0;

        if ($system_updates) {
            $unread_updates = count($database->select_many("system_updates", ["status" => "unread"]));
        }

        $branch = 'main';
        $commitCount = (int) trim(shell_exec("git rev-list --count $branch"));

        $major = 1 + (int) floor(($commitCount - 1) / 100);
        $minor = (int) floor((($commitCount - 1) % 100) / 10);
        $patch = ($commitCount - 1) % 10;

        $version = "$major.$minor.$patch";
    }
} else {
    $notification_message = [
        "title" => "Oops...",
        "text" => "You need to login first!",
        "icon" => "error",
    ];

    session("notification", $notification_message);

    redirect("/");
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Discover your style at the Personalized Online Fashion Shop. Get curated fashion recommendations and shop the latest trends tailored to you.">
    <meta name="author" content="Colegio de Montalban">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://prototype.personalizedonlinefashion.shop/">
    <meta property="og:title" content="Personalized Online Fashion Shop">
    <meta property="og:description" content="Explore custom fashion recommendations and shop trends tailored just for you at the Personalized Online Fashion Shop.">
    <meta property="og:image" content="https://prototype.personalizedonlinefashion.shop/assets/images/logo-light.webp">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://prototype.personalizedonlinefashion.shop/">
    <meta property="twitter:title" content="Personalized Online Fashion Shop">
    <meta property="twitter:description" content="Find your style with curated fashion picks and shop trends designed for you at the Personalized Online Fashion Shop.">
    <meta property="twitter:image" content="https://prototype.personalizedonlinefashion.shop/assets/images/logo-light.webp">

    <title>Personalized Online Fashion Shop</title>

    <!-- Favicon -->
    <link rel="icon" href="../favicon.ico" type="image/x-icon">

    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">
    <link rel="stylesheet" href="../assets/admin/plugins/fontawesome-free/css/all.min.css">
    <link rel="stylesheet" href="../assets/admin/plugins/sweetalert2-theme-bootstrap-4/bootstrap-4.min.css">
    <link rel="stylesheet" href="../assets/admin/plugins/datatables-bs4/css/dataTables.bootstrap4.min.css">
    <link rel="stylesheet" href="../assets/admin/plugins/datatables-responsive/css/responsive.bootstrap4.min.css">
    <link rel="stylesheet" href="../assets/admin/plugins/datatables-buttons/css/buttons.bootstrap4.min.css">
    <link rel="stylesheet" href="../assets/admin/dist/css/adminlte.min.css">
</head>

<body class="hold-transition sidebar-mini">
    <div class="wrapper">
        <div class="preloader flex-column justify-content-center align-items-center">
            <img class="animation__shake img-circle" src="../assets/images/logo-light.webp" alt="AdminLTELogo" height="60" width="60">

            <h4 class="mt-3 text-muted">Personalized Online Fashion Shop</h4>
        </div>

        <nav class="main-header navbar navbar-expand navbar-white navbar-light">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
                </li>
            </ul>

            <ul class="navbar-nav ml-auto">
                <?php if (session("user_type") == "admin"): ?>
                    <li class="nav-item dropdown">
                        <a class="nav-link" data-toggle="dropdown" href="javascript:void(0)">
                            <i class="far fa-bell"></i>
                            <?php if ((!session("unread_updates_viewed") || session("unread_updates_viewed") == false) && $unread_updates): ?>
                                <span class="badge badge-danger navbar-badge" id="system_updates_counter"><?= $unread_updates ?></span>
                            <?php endif ?>
                        </a>
                        <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                            <?php if ($system_updates): ?>
                                <?php foreach ($system_updates as $system_update): ?>
                                    <span system_update_id="<?= $system_update["id"] ?>" class="dropdown-item text-truncate view_system_update <?= $system_update["status"] == "unread" ? "text-bold" : null ?>" role="button">
                                        <i class="fas fa-info-circle mr-2"></i> <?= $system_update["system_update"] ?>
                                    </span>
                                    <div class="dropdown-divider"></div>
                                <?php endforeach ?>
                                <a href="system_updates" class="dropdown-item dropdown-footer">See All Updates</a>
                            <?php else: ?>
                                <span class="dropdown-item text-center text-muted py-5">
                                    No Available Updates
                                </span>
                            <?php endif ?>
                        </div>
                    </li>
                <?php endif ?>
                <li class="nav-item dropdown">
                    <a class="nav-link" data-toggle="dropdown" href="#">
                        <i class="fas fa-cog"></i>
                    </a>
                    <div class="dropdown-menu dropdown-menu-right">
                        <?php if (session("user_type") == "developer"): ?>
                            <a href="javascript:void(0)" class="dropdown-item" data-toggle="modal" data-target="#new_system_update_modal">
                                <i class="fas fa-sync mr-2"></i>
                                System Updates
                            </a>
                            <div class="dropdown-divider"></div>
                        <?php endif ?>
                        <a href="javascript:void(0)" class="dropdown-item account_settings no-function">
                            <i class="fas fa-user mr-2"></i>
                            Account Settings
                        </a>
                        <div class="dropdown-divider"></div>
                        <a href="javascript:void(0)" class="dropdown-item no-function">
                            <i class="fas fa-info-circle mr-2"></i>
                            About
                        </a>
                        <div class="dropdown-divider"></div>
                        <a href="javascript:void(0)" class="dropdown-item text-danger logout">
                            <i class="fas fa-sign-out-alt mr-2"></i>
                            Logout
                        </a>
                    </div>
                </li>
            </ul>
        </nav>

        <aside class="main-sidebar sidebar-dark-primary elevation-4">
            <a href="/" class="brand-link">
                <img src="../assets/images/logo-light.webp" alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style="opacity: .8; width: 33px; height: 33px;">
                <span class="brand-text font-weight-light">Personalized OFS</span>
            </a>
            <div class="sidebar">
                <div class="user-panel mt-3 pb-3 mb-3 d-flex">
                    <div class="image">
                        <img src="../uploads/users/<?= $user_data["image"] ?>" class="img-circle elevation-2" alt="User Image">
                    </div>
                    <div class="info">
                        <a href="javascript:void(0)" class="d-block account_settings no-function"><?= $user_data["name"] ?></a>
                    </div>
                </div>

                <nav class="mt-2">
                    <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                        <li class="nav-item">
                            <a href="dashboard" class="nav-link <?= session("page") == "admin" || session("page") == "admin/dashboard" ? "active" : null ?>">
                                <i class="nav-icon fas fa-tachometer-alt"></i>
                                <p>Dashboard</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="manage_products" class="nav-link <?= session("page") == "admin/manage_products" ? "active" : null ?>">
                                <i class="nav-icon fas fa-box-open"></i>
                                <p>Manage Products</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="javascript:void(0)" class="nav-link logout">
                                <i class="nav-icon fas fa-sign-out-alt"></i>
                                <p>Logout</p>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>