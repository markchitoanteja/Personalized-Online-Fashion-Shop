<!-- View System Update Modal -->
<div class="modal fade" id="view_system_update_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">System Update</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form action="javascript:void(0)" id="view_system_update_form">
                <div class="modal-body">
                    <div class="loading text-center py-5 d-none">
                        <img src="../assets/images/loading.gif" alt="Loading GIF" class="mb-3">
                        <h3 class="text-muted">Loading...</h3>
                    </div>
                    <div class="main-form">
                        <div class="mb-3">
                            <span id="view_system_update_created_at" class="text-muted"></span>
                        </div>
                        <div class="text-justify">
                            <h5 id="view_system_update_system_update"></h5>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                </div>
            </form>
        </div>
    </div>
</div>