<!-- Approve Custom Order Modal -->
<div class="modal fade" id="custom_order_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Approve Custom Order</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form action="javascript:void(0)" id="custom_order_form">
                <div class="modal-body">
                    <div class="loading text-center py-5 d-none">
                        <img src="../assets/images/loading.webp" alt="Loading GIF" class="mb-3">
                        <h3 class="text-muted">Loading...</h3>
                    </div>
                    <div class="main-form">
                        <div class="form-group">
                            <label for="custom_order_confirm_password">Price</label>
                            <input type="number" class="form-control" id="custom_order_price" required>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <input type="hidden" id="custom_order_id">
                    <input type="hidden" id="custom_order_quantity">

                    <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary" id="custom_order_submit">Approve Order</button>
                </div>
            </form>
        </div>
    </div>
</div>