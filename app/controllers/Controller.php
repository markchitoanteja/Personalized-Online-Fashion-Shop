<?php
class Controller
{
    private $database;
    private $success = false;
    private $message = null;

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

    private function login()
    {
        $username = post("username");
        $password = post("password");

        $user_data = $this->database->select_one("users", ["username" => $username]);

        if ($user_data) {
            $hash = $user_data["password"];

            if (password_verify($password, $hash)) {
                session("user_id", $user_data["id"]);
                session("user_type", $user_data["user_type"]);

                $notification_message = [
                    "title" => "Success!",
                    "text" => "Hello, " . $user_data["name"] . "!",
                    "icon" => "success",
                ];

                session("notification", $notification_message);

                $this->success = true;
            }
        }

        $this->response($this->success, $this->message);
    }

    private function register()
    {
        $name = post("name");
        $username = post("username");
        $password = post("password");

        $user_data = $this->database->select_one("users", ["username" => $username]);

        if (!$user_data) {
            $data = [
                "uuid" => $this->database->generate_uuid(),
                "name" => $name,
                "username" => $username,
                "password" => password_hash($password, PASSWORD_BCRYPT),
                "image" => "default-user-image.png",
                "user_type" => "customer",
                "created_at" => date("Y-m-d H:i:s"),
                "updated_at" => date("Y-m-d H:i:s"),
            ];

            $this->database->insert("users", $data);

            session("user_id", $this->database->get_last_insert_id());

            $notification_message = [
                "title" => "Success!",
                "text" => "Your account has been created successfully.",
                "icon" => "success",
            ];

            session("notification", $notification_message);

            $this->success = true;
        } else {
            $this->message = "Username is already taken!";
        }

        $this->response($this->success, $this->message);
    }

    private function new_product()
    {
        $name = post("name");
        $category = post("category");
        $price = post("price");
        $image = upload("image", "uploads/products");

        if ($image) {
            $data = [
                "uuid" => $this->database->generate_uuid(),
                "name" => $name,
                "category" => $category,
                "price" => $price,
                "image" => $image,
                "created_at" => date("Y-m-d H:i:s"),
                "updated_at" => date("Y-m-d H:i:s"),
            ];

            $this->database->insert("products", $data);

            $notification_message = [
                "title" => "Success!",
                "text" => "A new product has been added to the database.",
                "icon" => "success",
            ];

            $this->success = true;
        } else {
            $notification_message = [
                "title" => "Oops...",
                "text" => "There was an error while uploading your image.",
                "icon" => "error",
            ];
        }

        session("notification", $notification_message);

        $this->response($this->success, $this->message);
    }

    private function new_system_update()
    {
        $system_update = post("system_update");

        $data = [
            "uuid" => $this->database->generate_uuid(),
            "system_update" => $system_update,
            "status" => "unread",
            "created_at" => date("Y-m-d H:i:s"),
            "updated_at" => date("Y-m-d H:i:s"),
        ];

        $this->database->insert("system_updates", $data);

        $notification_message = [
            "title" => "Success!",
            "text" => "A new system update has been added to the database.",
            "icon" => "success",
        ];

        $this->success = true;

        session("notification", $notification_message);

        $this->response($this->success, $this->message);
    }

    private function update_system_updates()
    {
        $data = [
            "status" => "read",
            "updated_at" => date("Y-m-d H:i:s"),
        ];

        $this->database->update("system_updates", $data, ["status" => "unread"]);

        $this->success = true;

        $this->response($this->success, $this->message);
    }

    private function get_system_update_data()
    {
        $id = post("id");

        $system_update_data = $this->database->select_one("system_updates", ["id" => $id]);

        $this->message = $system_update_data;
        $this->success = true;

        $this->response($this->success, $this->message);
    }

    private function logout()
    {
        session("user_id", "unset");
        session("user_type", "unset");

        $notification_message = [
            "title" => "Success!",
            "text" => "You have been logged out.",
            "icon" => "success",
        ];

        session("notification", $notification_message);

        $this->success = true;

        $this->response($this->success, $this->message);
    }

    private function response(bool $success, $message = null)
    {
        echo json_encode(['success' => $success, 'message' => $message]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    new Controller();
} else {
    redirect("500", 500);
}
