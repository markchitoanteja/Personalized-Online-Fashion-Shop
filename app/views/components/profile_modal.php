<!-- Register Modal -->
<div class="modal fade" id="profile_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Update Profile</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form action="javascript:void(0)" id="profile_form">
                <div class="modal-body">
                    <div class="loading text-center py-5 d-none">
                        <img src="assets/images/loading.webp" alt="Loading GIF" class="mb-3">
                        <h3 class="text-muted">Loading...</h3>
                    </div>
                    <div class="main-form">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="form-group text-center">
                                    <img src="uploads/users/default-user-image.png" id="profile_image_display" class="img-thumbnail mb-3" style="width: 200px; height: 200px;">
                                    <input type="file" id="profile_image" class="form-control-file" accept="image/*">
                                </div>
                            </div>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="col-lg-4">
                                <div class="form-group">
                                    <label for="profile_first_name">First Name</label>
                                    <input type="text" class="form-control" id="profile_first_name" required>
                                </div>
                            </div>
                            <div class="col-lg-4">
                                <div class="form-group">
                                    <label for="profile_middle_name">Middle Name</label>
                                    <input type="text" class="form-control" id="profile_middle_name">
                                </div>
                            </div>
                            <div class="col-lg-4">
                                <div class="form-group">
                                    <label for="profile_last_name">Last Name</label>
                                    <input type="text" class="form-control" id="profile_last_name" required>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-4">
                                <div class="form-group">
                                    <label for="profile_birthday">Birthday</label>
                                    <input type="date" class="form-control" id="profile_birthday" required>
                                </div>
                            </div>
                            <div class="col-lg-4">
                                <div class="form-group">
                                    <label for="profile_email">Email</label>
                                    <input type="email" class="form-control" id="profile_email" required>
                                    <small class="text-danger d-none" id="error_profile_email">Email already exists!</small>
                                </div>
                            </div>
                            <div class="col-lg-4">
                                <div class="form-group">
                                    <label for="profile_mobile_number">Mobile Number</label>
                                    <input type="text" class="form-control" id="profile_mobile_number" maxlength="11" minlength="11" pattern="\d{11}" title="Mobile number must be 11 digits" required>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="form-group">
                                    <label for="profile_address">Address</label>
                                    <textarea id="profile_address" class="form-control" rows="2" required></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-4">
                                <div class="form-group">
                                    <label for="profile_username">Username</label>
                                    <input type="text" class="form-control" id="profile_username" required>
                                    <small class="text-danger d-none" id="error_profile_username">Username already exists!</small>
                                </div>
                            </div>
                            <div class="col-lg-4">
                                <div class="form-group">
                                    <label for="profile_password">Password</label>
                                    <input type="password" class="form-control" id="profile_password" placeholder="Password is hidden">
                                </div>
                            </div>
                            <div class="col-lg-4">
                                <div class="form-group">
                                    <label for="profile_confirm_password">Confirm Password</label>
                                    <input type="password" class="form-control" id="profile_confirm_password" placeholder="Password is hidden">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <input type="hidden" id="profile_user_id">
                    <input type="hidden" id="profile_old_email">
                    <input type="hidden" id="profile_old_username">
                    <input type="hidden" id="profile_old_password">
                    <input type="hidden" id="profile_old_image">

                    <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary" id="profile_submit">Submit</button>
                </div>
            </form>
        </div>
    </div>
</div>