<?php
class Controller
{
    private $database;

    public function __construct()
    {
        $this->database = new Database();

        $action = post("action") ?? null;

        if (method_exists($this, $action)) {
            $this->$action();
        } else {
            $this->response(false, "Action do not exists!");
        }
    }

    private function response(bool $success, $message = null)
    {
        echo json_encode(['success' => $success, 'message' => $message]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    new Controller();
} else {
    http_response_code(500);

    header("location: 500");

    exit();
}
