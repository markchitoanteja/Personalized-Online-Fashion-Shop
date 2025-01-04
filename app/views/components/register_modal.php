<!-- Register Modal -->
<div class="modal fade" id="register_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
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
                        <img src="assets/images/loading.webp" alt="Loading GIF" class="mb-3">
                        <h3 class="text-muted">Loading...</h3>
                    </div>
                    <div class="main-form">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="form-group text-center">
                                    <img src="uploads/users/default-user-image.png" id="register_image_display" class="img-thumbnail mb-3" style="width: 200px; height: 200px;">
                                    <input type="file" id="register_image" class="form-control-file" accept="image/*" required>
                                </div>
                            </div>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="col-lg-4">
                                <div class="form-group">
                                    <label for="register_first_name">First Name</label>
                                    <input type="text" class="form-control" id="register_first_name" required>
                                </div>
                            </div>
                            <div class="col-lg-4">
                                <div class="form-group">
                                    <label for="register_middle_name">Middle Name</label>
                                    <input type="text" class="form-control" id="register_middle_name">
                                </div>
                            </div>
                            <div class="col-lg-4">
                                <div class="form-group">
                                    <label for="register_last_name">Last Name</label>
                                    <input type="text" class="form-control" id="register_last_name" required>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-4">
                                <div class="form-group">
                                    <label for="register_birthday">Birthday</label>
                                    <input type="date" class="form-control" id="register_birthday" required>
                                </div>
                            </div>
                            <div class="col-lg-4">
                                <div class="form-group">
                                    <label for="register_email">Email</label>
                                    <input type="email" class="form-control" id="register_email" required>
                                    <small class="text-danger d-none" id="error_register_email">Email already exists!</small>
                                </div>
                            </div>
                            <div class="col-lg-4">
                                <div class="form-group">
                                    <label for="register_mobile_number">Mobile Number</label>
                                    <input type="text" class="form-control" id="register_mobile_number" maxlength="11" minlength="11" pattern="\d{11}" title="Mobile number must be 11 digits" required>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label for="register_region">Region</label>
                                    <div class="d-flex align-items-center">
                                        <select id="register_region" class="custom-select" required>
                                            <option value selected disabled></option>

                                            <?php
                                            $database = new Database();

                                            $regions = $database->query("SELECT * FROM ph_address_regions ORDER BY region_description ASC");
                                            ?>

                                            <?php foreach ($regions as $region) : ?>
                                                <option value="<?= $region['region_code'] ?>"><?= $region['region_description'] ?></option>
                                            <?php endforeach; ?>
                                        </select>
                                        <div class="spinner-border spinner-border-sm text-muted ml-2 d-none" role="status">
                                            <span class="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label for="register_province">Province</label>
                                    <div class="d-flex align-items-center">
                                        <select id="register_province" class="custom-select" disabled required>
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
                                    <label for="register_city_municipality">City/Municipality</label>
                                    <div class="d-flex align-items-center">
                                        <select id="register_city_municipality" class="custom-select" disabled required>
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
                                    <label for="register_barangay">Barangay</label>
                                    <select id="register_barangay" class="custom-select" disabled required>
                                        <!-- Barangay options will be fetched using AJAX -->
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="form-group">
                                    <label for="register_address">Complete Address <small>(Include Street and House Number)</small></label>
                                    <textarea id="register_address" rows="3" class="form-control" required></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-4">
                                <div class="form-group">
                                    <label for="register_username">Username</label>
                                    <input type="text" class="form-control" id="register_username" required>
                                    <small class="text-danger d-none" id="error_register_username">Username already exists!</small>
                                </div>
                            </div>
                            <div class="col-lg-4">
                                <div class="form-group">
                                    <label for="register_password">Password</label>
                                    <input type="password" class="form-control" id="register_password" required>
                                </div>
                            </div>
                            <div class="col-lg-4">
                                <div class="form-group">
                                    <label for="register_confirm_password">Confirm Password</label>
                                    <input type="password" class="form-control" id="register_confirm_password" required>
                                </div>
                            </div>
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