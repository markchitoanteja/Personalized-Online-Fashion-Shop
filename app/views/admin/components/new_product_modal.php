<!-- New Product Modal -->
<div class="modal fade" id="new_product_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">New Product</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form action="javascript:void(0)" id="new_product_form">
                <div class="modal-body">
                    <div class="loading text-center py-5 d-none">
                        <img src="../assets/images/loading.gif" alt="Loading GIF" class="mb-3">
                        <h3 class="text-muted">Loading...</h3>
                    </div>
                    <div class="main-form">
                        <div class="alert alert-danger text-center d-none" id="new_product_alert">Invalid input! Please check the fields.</div>

                        <div class="form-group text-center">
                            <img id="new_product_image_preview" src="../uploads/products/default-item-image.png" alt="Product Image Preview" class="img-thumbnail mb-3" style="width: 200px; height: 150px;">
                            <input type="file" class="form-control-file" id="new_product_image" accept="image/*" required>
                        </div>
                        <div class="form-group">
                            <label for="new_product_name">Product Name</label>
                            <input type="text" class="form-control" id="new_product_name" required>
                        </div>
                        <div class="form-group">
                            <label for="new_product_category">Category</label>
                            <select id="new_product_category" class="custom-select" required>
                                <option value selected disabled></option>
                                <option value="Men">Men</option>
                                <option value="Women">Women</option>
                                <option value="Kids">Kids</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="new_product_price">Price</label>
                            <input type="number" class="form-control" id="new_product_price" required>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary" id="new_product_submit">Submit</button>
                </div>
            </form>
        </div>
    </div>
</div>