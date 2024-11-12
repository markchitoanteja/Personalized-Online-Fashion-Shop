<?php
include_once 'header.php';

if (session("page")) {
    include_once "../app/views/pages/" . session("page") . ".php";
} else {
    redirect("500", 500);
}

include_once 'footer.php';
