        <?php include_once "../app/views/admin/components/new_system_update_modal.php" ?>
        <?php include_once "../app/views/admin/components/view_system_update_modal.php" ?>11

        <footer class="main-footer">
            <div class="float-right d-none d-sm-block">
                <b>Version</b> <?= $version ?>
            </div>
            <strong>Copyright &copy; 2024 <a href="/">Personalized Online Fashion Shop</a>.</strong> All rights reserved.
        </footer>
    </div>
    
    <script>
        var user_id = "<?= session("user_id") ?>";
        var user_type = "<?= session("user_type") ?>";
        var page = "<?= session("page") ?>";
        var notification = <?= session("notification") ? json_encode(session("notification")) : json_encode(null) ?>;
    </script>

    <script src="../assets/admin/plugins/jquery/jquery.min.js"></script>
    <script src="../assets/admin/plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="../assets/admin/plugins/sweetalert2/sweetalert2.min.js"></script>
    <script src="../assets/admin/plugins/datatables/jquery.dataTables.min.js"></script>
    <script src="../assets/admin/plugins/datatables-bs4/js/dataTables.bootstrap4.min.js"></script>
    <script src="../assets/admin/plugins/datatables-responsive/js/dataTables.responsive.min.js"></script>
    <script src="../assets/admin/plugins/datatables-responsive/js/responsive.bootstrap4.min.js"></script>
    <script src="../assets/admin/plugins/datatables-buttons/js/dataTables.buttons.min.js"></script>
    <script src="../assets/admin/plugins/datatables-buttons/js/buttons.bootstrap4.min.js"></script>
    <script src="../assets/admin/dist/js/adminlte.min.js"></script>
    <script src="../assets/js/admin.js"></script>
</body>

</html>

<?php session("notification", "unset") ?>