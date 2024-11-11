<!-- Register Modal -->
<div class="modal fade" id="register_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Create an Account</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form action="javascript:void(0)" id="register_form">
                <div class="modal-body">
                    <div class="loading text-center py-5 d-none">
                        <img src="assets/images/loading.gif" alt="Loading GIF" class="mb-3">
                        <h3 class="text-muted">Loading...</h3>
                    </div>
                    <div class="main-form">
                        <div class="alert alert-danger text-center d-none" id="register_alert">Username is already taken!</div>

                        <div class="form-group">
                            <label for="register_name">Name</label>
                            <input type="text" class="form-control" id="register_name" required>
                        </div>
                        <div class="form-group">
                            <label for="register_username">Username</label>
                            <input type="text" class="form-control" id="register_username" required>
                        </div>
                        <div class="form-group">
                            <label for="register_password">Password</label>
                            <input type="password" class="form-control" id="register_password" required>
                        </div>
                        <div class="form-group">
                            <label for="register_confirm_password">Confirm Password</label>
                            <input type="password" class="form-control" id="register_confirm_password" required>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary" id="register_submit">Submit</button>
                </div>
            </form>
        </div>
    </div>
</div>