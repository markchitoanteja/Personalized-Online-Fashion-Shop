<!-- Custom Order Modal -->
<div class="modal fade" id="custom_order_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Custom Order</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form action="javascript:void(0)" id="custom_order_form">
                <div class="modal-body">
                    <div class="loading text-center py-5 d-none">
                        <img src="assets/images/loading.webp" alt="Loading GIF" class="mb-3">
                        <h3 class="text-muted">Loading...</h3>
                    </div>
                    <div class="main-form">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="form-group text-center">
                                    <img id="custom_order_image_display" src="uploads/products/default-item-image.png" alt="Product Image Preview" class="img-thumbnail mb-3" style="width: 259px; height: 273px;">
                                    <input type="file" class="form-control-file" id="custom_order_image" accept="image/*" required>
                                </div>
                            </div>
                        </div>
                        <hr>

                        <div class="row">
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label for="custom_order_name">Product Name</label>
                                    <input type="text" class="form-control" id="custom_order_name" required>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label for="custom_order_category">Category</label>
                                    <select id="custom_order_category" class="custom-select" required>
                                        <option value selected disabled></option>
                                        <option value="Men">Men</option>
                                        <option value="Women">Women</option>
                                        <option value="Kids">Kids</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label for="custom_order_price">Price</label>
                                    <input type="number" class="form-control" id="custom_order_price" disabled>
                                    <small class="text-muted">The price is decided by the seller</small>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label for="custom_order_quantity">Quantity</label>
                                    <input type="number" class="form-control" id="custom_order_quantity" required>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <input type="hidden" id="custom_order_customer_id" value="<?= $user_data["id"] ?>">

                    <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary" id="custom_order_submit">Submit</button>
                </div>
            </form>
        </div>
    </div>
</div>