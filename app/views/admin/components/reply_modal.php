<!-- Reply to Conversation Modal -->
<div class="modal fade" id="reply_modal" tabindex="-1" aria-labelledby="replyModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="replyModalLabel">Reply to <span id="reply_name_header"></span></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="loading text-center py-5 d-none">
                    <img src="../assets/images/loading.webp" alt="Loading..." class="mb-3" style="width: 50px; height: 50px;">
                    <h5 class="text-muted">Loading...</h5>
                </div>
                <div class="main-form">
                    <div class="row">
                        <div class="col-md-6 mb-4">
                            <h4 class="text-secondary">Conversation Details</h4>
                            <p class="mb-1"><b>From:</b> <span id="reply_name"></span></p>
                            <p class="mb-1"><b>Date:</b> <span id="reply_created_at"></span></p>
                            <p class="mb-1"><b>Message:</b></p>
                            <div class="bg-light border p-3 rounded">
                                <span id="reply_message" class="text-dark"></span>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <h4 class="text-secondary">Your Reply</h4>
                            <textarea class="form-control mb-3" rows="6" placeholder="Type your reply here..." id="reply_message_send"></textarea>
                            <button type="button" class="btn btn-primary btn-block" id="reply_submit">Send Reply</button>

                            <input type="hidden" id="reply_id">
                            <input type="hidden" id="reply_receiver_id">
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