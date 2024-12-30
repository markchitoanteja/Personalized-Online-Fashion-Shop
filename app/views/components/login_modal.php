<!-- Login Modal -->
<div class="modal fade" id="login_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Login</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form action="javascript:void(0)" id="login_form">
                <div class="modal-body">
                    <div class="loading text-center py-5 d-none">
                        <img src="assets/images/loading.webp" alt="Loading GIF" class="mb-3">
                        <h3 class="text-muted">Loading...</h3>
                    </div>
                    <div class="main-form">
                        <div class="alert alert-danger text-center d-none" id="login_alert">Invalid Username or Password!</div>

                        <div class="form-group">
                            <label for="login_username">Username</label>
                            <input type="text" class="form-control" id="login_username" value="<?= session("remember_me_username") ?>" required>
                        </div>
                        <div class="form-group mb-1">
                            <label for="login_password">Password</label>
                            <input type="password" class="form-control" id="login_password" value="<?= session("remember_me_password") ?>" required>
                        </div>
                        <div class="form-group form-check">
                            <input type="checkbox" class="form-check-input remember_me_checkbox" id="login_remember_me" <?= session("remember_me") ? "checked" : null ?>>
                            <label class="form-check-label remember_me_checkbox" for="login_remember_me">Remember Me</label>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary" id="login_submit">Submit</button>
                </div>
            </form>
        </div>
    </div>
</div>