<!-- Product Details Modal -->
<div class="modal fade" id="product_details_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Product Details</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="loading text-center py-5 d-none">
                    <img src="../assets/images/loading.webp" alt="Loading GIF" class="mb-3">
                    <h3 class="text-muted">Loading...</h3>
                </div>
                <div class="main-form">
                    <div class="row">
                        <div class="col-lg-12 text-center">
                            <img id="product_details_image" src="../uploads/products/default-item-image.png" alt="Product Image Preview" class="img-thumbnail mb-3" style="width: 259px; height: 273px;">
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-lg-4">
                            <strong>Product Name:</strong>
                        </div>
                        <div class="col-lg-8">
                            <span id="product_details_name">Test Product for Men</span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-4">
                            <strong>Category:</strong>
                        </div>
                        <div class="col-lg-8">
                            <span id="product_details_category">Men</span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-4">
                            <strong>Price:</strong>
                        </div>
                        <div class="col-lg-8">
                            <i class="fas fa-peso-sign"></i><span id="product_details_price">0.00</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>