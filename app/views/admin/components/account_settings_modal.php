<!-- Account Settings Modal -->
<div class="modal fade" id="account_settings_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Account Settings</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form action="javascript:void(0)" id="account_settings_form">
                <div class="modal-body">
                    <div class="loading text-center py-5 d-none">
                        <img src="../assets/images/loading.webp" alt="Loading GIF" class="mb-3">
                        <h3 class="text-muted">Loading...</h3>
                    </div>
                    <div class="main-form">
                        <div class="text-center mb-3">
                            <img id="account_settings_image_display" class="rounded-circle" alt="User Image" style="width: 100px; height: 100px;">
                        </div>
                        <div class="form-group text-center">
                            <label for="account_settings_image">Upload Image</label>
                            <input type="file" class="form-control-file" id="account_settings_image" accept="image/*">
                        </div>
                        <div class="form-group">
                            <label for="account_settings_name">Name</label>
                            <input type="text" class="form-control" id="account_settings_name" placeholder="Enter your name" required>
                        </div>
                        <div class="form-group">
                            <label for="account_settings_username">Username</label>
                            <input type="text" class="form-control" id="account_settings_username" placeholder="Enter your username" required>
                            <small class="text-danger d-none" id="error_account_settings_username">Username is already in use</small>
                        </div>
                        <div class="form-group">
                            <label for="account_settings_password">Password</label>
                            <input type="password" class="form-control" id="account_settings_password" placeholder="Password hidden for security purposes">
                            <small class="text-danger d-none" id="error_account_settings_password">Passwords do not match</small>
                        </div>
                        <div class="form-group">
                            <label for="account_settings_confirm_password">Confirm Password</label>
                            <input type="password" class="form-control" id="account_settings_confirm_password" placeholder="Password hidden for security purposes">
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <input type="hidden" id="account_settings_id">
                    <input type="hidden" id="account_settings_old_password">
                    <input type="hidden" id="account_settings_old_image">

                    <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary" id="account_settings_submit">Submit</button>
                </div>
            </form>
        </div>
    </div>
</div>