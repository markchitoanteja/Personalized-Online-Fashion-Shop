<?php
include_once 'header.php';

if (session("page")) {
    include_once "../app/views/pages/" . session("page") . ".php";
} else {
    http_response_code(500);

    header("Location: 500");
    
    exit();
}

include_once 'footer.php';
