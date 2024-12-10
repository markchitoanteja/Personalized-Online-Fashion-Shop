<!-- New Product Modal -->
<div class="modal fade" id="update_product_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Update Product</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form action="javascript:void(0)" id="update_product_form">
                <div class="modal-body">
                    <div class="loading text-center py-5 d-none">
                        <img src="../assets/images/loading.webp" alt="Loading GIF" class="mb-3">
                        <h3 class="text-muted">Loading...</h3>
                    </div>
                    <div class="main-form">
                        <div class="alert alert-danger text-center d-none" id="update_product_alert">Invalid input! Please check the fields.</div>

                        <div class="form-group text-center">
                            <img id="update_product_image_preview" src="../uploads/products/default-item-image.png" alt="Product Image Preview" class="img-thumbnail mb-3" style="width: 259px; height: 273px;">
                            <input type="file" class="form-control-file" id="update_product_image" accept="image/*">
                        </div>
                        <div class="form-group">
                            <label for="update_product_name">Product Name</label>
                            <input type="text" class="form-control" id="update_product_name" required>
                        </div>
                        <div class="form-group">
                            <label for="update_product_category">Category</label>
                            <select id="update_product_category" class="custom-select" required>
                                <option value="Men">Men</option>
                                <option value="Women">Women</option>
                                <option value="Kids">Kids</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="update_product_price">Price</label>
                            <input type="number" class="form-control" id="update_product_price" required>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <input type="hidden" id="update_product_id">
                    <input type="hidden" id="update_product_old_image">

                    <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary" id="update_product_submit">Save changes</button>
                </div>
            </form>
        </div>
    </div>
</div>