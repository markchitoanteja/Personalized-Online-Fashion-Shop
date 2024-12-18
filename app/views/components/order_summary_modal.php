<!-- Order Summary Modal -->
<div class="modal fade" id="order_summary_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Order Summary</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form action="javascript:void(0)" id="order_summary_form">
                <div class="modal-body">
                    <div class="loading text-center py-5 d-none">
                        <img src="assets/images/loading.webp" alt="Loading GIF" class="mb-3">
                        <h3 class="text-muted">Loading...</h3>
                    </div>
                    <div id="orderSummaryContent" class="main-form">
                        <!-- Order details will be dynamically inserted here -->
                    </div>
                </div>
                <div class="modal-footer">
                    <input type="hidden" id="order_summary_order_ids">

                    <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary" id="order_summary_submit">Place Order</button>
                </div>
            </form>
        </div>
    </div>
</div>