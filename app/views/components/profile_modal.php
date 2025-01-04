<!-- Update Profile Modal -->
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
                                    <label for="profile_middle_name">Middle Name <small class="text-muted">(Optional)</small></label>
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
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label for="profile_region">Region</label>
                                    <div class="d-flex align-items-center">
                                        <select id="profile_region" class="custom-select" required>
                                            <!-- Region options will be fetched using AJAX -->
                                        </select>
                                        <div class="spinner-border spinner-border-sm text-muted ml-2 d-none" role="status">
                                            <span class="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label for="profile_province">Province</label>
                                    <div class="d-flex align-items-center">
                                        <select id="profile_province" class="custom-select" disabled required>
                                            <!-- Province options will be fetched using AJAX -->
                                        </select>
                                        <div class="spinner-border spinner-border-sm text-muted ml-2 d-none" role="status">
                                            <span class="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label for="profile_city_municipality">City/Municipality</label>
                                    <div class="d-flex align-items-center">
                                        <select id="profile_city_municipality" class="custom-select" disabled required>
                                            <!-- City/Municipality options will be fetched using AJAX -->
                                        </select>
                                        <div class="spinner-border spinner-border-sm text-muted ml-2 d-none" role="status">
                                            <span class="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label for="profile_barangay">Barangay</label>
                                    <select id="profile_barangay" class="custom-select" disabled required>
                                        <!-- Barangay options will be fetched using AJAX -->
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="form-group">
                                    <label for="profile_address">Complete Address <small>(Include Street and House Number)</small></label>
                                    <textarea id="profile_address" rows="4" class="form-control" required></textarea>
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