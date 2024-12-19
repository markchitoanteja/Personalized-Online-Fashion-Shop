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
        $first_name = post("first_name");
        $middle_name = post("middle_name");
        $last_name = post("last_name");
        $birthday = post("birthday");
        $email = post("email");
        $mobile_number = post("mobile_number");
        $address = post("address");
        $username = post("username");
        $password = post("password");

        $this->message = [
            "is_error_email" => false,
            "is_error_username" => false,
        ];

        $is_error = false;

        if ($this->database->select_one("customers", ["email" => $email])) {
            $this->message["is_error_email"] = true;

            $is_error = true;
        }

        if ($this->database->select_one("users", ["username" => $username])) {
            $this->message["is_error_username"] = true;

            $is_error = true;
        }

        if (!$is_error) {
            $image = upload("image", "uploads/users");

            if ($image) {
                $name = $first_name . ' ' . ($middle_name ? strtoupper(substr($middle_name, 0, 1)) . '. ' : '') . $last_name;

                $user_data = [
                    "uuid" => $this->database->generate_uuid(),
                    "name" => $name,
                    "username" => $username,
                    "password" => password_hash($password, PASSWORD_BCRYPT),
                    "image" => $image,
                    "user_type" => "customer",
                    "created_at" => date("Y-m-d H:i:s"),
                    "updated_at" => date("Y-m-d H:i:s"),
                ];

                $this->database->insert("users", $user_data);

                $user_id = $this->database->get_last_insert_id();

                $customer_data = [
                    "uuid" => $this->database->generate_uuid(),
                    "user_id" => $user_id,
                    "first_name" => $first_name,
                    "middle_name" => $middle_name,
                    "last_name" => $last_name,
                    "birthday" => $birthday,
                    "email" => $email,
                    "mobile_number" => $mobile_number,
                    "address" => $address,
                    "created_at" => date("Y-m-d H:i:s"),
                    "updated_at" => date("Y-m-d H:i:s"),
                ];

                $this->database->insert("customers", $customer_data);

                session("user_id", $user_id);

                $notification_message = [
                    "title" => "Success!",
                    "text" => "Your account has been created successfully.",
                    "icon" => "success",
                ];
            } else {
                $notification_message = [
                    "title" => "Oops...",
                    "text" => "There was an error while uploading your image.",
                    "icon" => "error",
                ];
            }

            session("notification", $notification_message);

            $this->success = true;
        }

        $this->response($this->success, $this->message);
    }

    private function update_profile()
    {
        $first_name = post("first_name");
        $middle_name = post("middle_name");
        $last_name = post("last_name");
        $birthday = post("birthday");
        $email = post("email");
        $mobile_number = post("mobile_number");
        $address = post("address");
        $username = post("username");
        $password = post("password");

        $user_id = post("user_id");
        $old_email = post("old_email");
        $old_username = post("old_username");
        $old_password = post("old_password");
        $old_image = post("old_image");

        $this->message = [
            "is_error_email" => false,
            "is_error_username" => false,
        ];

        $is_error = false;

        if (($email != $old_email) && ($this->database->select_one("customers", ["email" => $email]))) {
            $this->message["is_error_email"] = true;

            $is_error = true;
        }

        if (($username != $old_username) && ($this->database->select_one("users", ["username" => $username]))) {
            $this->message["is_error_username"] = true;

            $is_error = true;
        }

        if (!$is_error) {
            $image = file_data("image") ? upload("image", "uploads/users") : $old_image;

            if ($image) {
                $name = $first_name . ' ' . ($middle_name ? strtoupper(substr($middle_name, 0, 1)) . '. ' : '') . $last_name;

                $password = $password ? password_hash($password, PASSWORD_BCRYPT) : $old_password;

                $user_data = [
                    "name" => $name,
                    "username" => $username,
                    "password" => $password,
                    "image" => $image,
                    "updated_at" => date("Y-m-d H:i:s"),
                ];

                $this->database->update("users", $user_data, ["id" => $user_id]);

                $customer_data = [
                    "first_name" => $first_name,
                    "middle_name" => $middle_name,
                    "last_name" => $last_name,
                    "birthday" => $birthday,
                    "email" => $email,
                    "mobile_number" => $mobile_number,
                    "address" => $address,
                    "updated_at" => date("Y-m-d H:i:s"),
                ];

                $this->database->update("customers", $customer_data, ["user_id" => $user_id]);

                $notification_message = [
                    "title" => "Success!",
                    "text" => "Your account has been updated successfully.",
                    "icon" => "success",
                ];
            } else {
                $notification_message = [
                    "title" => "Oops...",
                    "text" => "There was an error while uploading your image.",
                    "icon" => "error",
                ];
            }

            session("notification", $notification_message);

            $this->success = true;
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

    private function update_product()
    {
        $name = post("name");
        $category = post("category");
        $price = post("price");

        $id = post("id");
        $old_image = post("old_image");

        $image = file_data("image") ? upload("image", "uploads/products") : $old_image;

        if ($image) {
            $data = [
                "name" => $name,
                "category" => $category,
                "price" => $price,
                "image" => $image,
                "updated_at" => date("Y-m-d H:i:s"),
            ];

            $this->database->update("products", $data, ["id" => $id]);

            $notification_message = [
                "title" => "Success!",
                "text" => "A new product has been updated successfully.",
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

    private function delete_product()
    {
        $id = post("id");

        $this->database->delete("products", ["id" => $id]);

        $notification_message = [
            "title" => "Success!",
            "text" => "A product has been successfully deleted.",
            "icon" => "success",
        ];

        $this->success = true;

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

    private function update_system_update()
    {
        $id = post("id");

        $data = [
            "status" => "read",
            "updated_at" => date("Y-m-d H:i:s"),
        ];

        $this->database->update("system_updates", $data, ["id" => $id, "status" => "unread"], "AND");

        $this->success = true;

        $this->response($this->success, $this->message);
    }

    private function update_system_updates()
    {
        session("unread_updates_viewed", true);

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

    private function subscribe()
    {
        $name = post("name");
        $email = post("email");

        $data = [
            "uuid" => $this->database->generate_uuid(),
            "name" => $name,
            "email" => $email,
            "created_at" => date("Y-m-d H:i:s"),
            "updated_at" => date("Y-m-d H:i:s"),
        ];

        if ($this->database->insert("newsletter_contacts", $data)) {
            $notification_message = [
                "title" => "Success!",
                "text" => "Thank you for subscribing to our mailing list.",
                "icon" => "success",
            ];

            $this->success = true;

            session("notification", $notification_message);
        }

        $this->response($this->success, $this->message);
    }

    private function contact_us()
    {
        $name = post("name");
        $email = post("email");
        $message = post("message");

        $data = [
            "uuid" => $this->database->generate_uuid(),
            "name" => $name,
            "email" => $email,
            "message" => $message,
            "created_at" => date("Y-m-d H:i:s"),
            "updated_at" => date("Y-m-d H:i:s"),
        ];

        if ($this->database->insert("contact_messages", $data)) {
            $notification_message = [
                "title" => "Success!",
                "text" => "Thank you for reaching out. We will get back to you soon.",
                "icon" => "success",
            ];

            $this->success = true;

            session("notification", $notification_message);
        }

        $this->response($this->success, $this->message);
    }

    private function get_profile_data()
    {
        $id = post("id");

        $profile_data = $this->database->select_one("users", ["users.id" => $id], "AND", [["table" => "customers", "on" => "users.id = customers.user_id"]]);

        $this->success = true;
        $this->message = $profile_data;

        $this->response($this->success, $this->message);
    }

    private function get_product_data()
    {
        $id = post("id");

        $product_data = $this->database->select_one("products", ["id" => $id]);

        $this->success = true;
        $this->message = $product_data;

        $this->response($this->success, $this->message);
    }

    private function get_order_data_with_product_name()
    {
        $id = post("id");

        $order_data = $this->database->select_one("orders", ["id" => $id]);
        $product_id = $order_data["product_id"];

        $product_name = $this->database->select_one("products", ["id" => $product_id])["name"];

        $this->success = true;
        $this->message = array_merge($order_data, ["product_name" => $product_name]);

        $this->response($this->success, $this->message);
    }

    private function get_user_data()
    {
        $id = post("id");

        $user_data = $this->database->select_one("users", ["id" => $id]);

        $this->success = true;
        $this->message = $user_data;

        $this->response($this->success, $this->message);
    }

    private function update_user_account()
    {
        $name = post("name");
        $username = post("username");
        $password = post("password");

        $id = post("id");
        $old_password = post("old_password");
        $old_image = post("old_image");

        $image = file_data("image") ? upload("image", "uploads/users") : $old_image;
        $password = $password ? password_hash($password, PASSWORD_BCRYPT) : $old_password;

        $data = [
            "name" => $name,
            "username" => $username,
            "password" => $password,
            "image" => $image,
            "updated_at" => date("Y-m-d H:i:s"),
        ];

        if ($this->database->update("users", $data, ["id" => $id])) {
            $notification_message = [
                "title" => "Success!",
                "text" => "Your account has been successfully updated.",
                "icon" => "success",
            ];

            $this->success = true;

            session("notification", $notification_message);
        }

        $this->response($this->success, $this->message);
    }

    private function add_to_cart()
    {
        $user_id = post("user_id");
        $product_id = post("product_id");
        $quantity = 1;

        $product = $this->database->select_one("products", ["id" => $product_id]);
        $order = $this->database->select_one("orders", ["user_id" => $user_id, "product_id" => $product_id, "status" => "Cart"], "AND");

        if ($order) {
            $id = $order["id"];
            $quantity = intval($order["quantity"]) + 1;
            $total_price = floatval($product["price"]) * $quantity;

            $data = [
                "quantity" => $quantity,
                "total_price" => $total_price,
                "updated_at" => date("Y-m-d H:i:s"),
            ];

            $this->database->update("orders", $data, ["id" => $id, "status" => "Cart"]);
        } else {
            $total_price = floatval($product["price"]) * $quantity;

            $data = [
                "uuid" => $this->database->generate_uuid(),
                "user_id" => $user_id,
                "product_id" => $product_id,
                "quantity" => $quantity,
                "total_price" => $total_price,
                "status" => "Cart",
                "created_at" => date("Y-m-d H:i:s"),
                "updated_at" => date("Y-m-d H:i:s"),
            ];

            $this->database->insert("orders", $data);
        }

        $cart = count($this->database->select_many("orders", ["user_id" => $user_id, "status" => "Cart"]));

        $this->message = ["cart" => $cart];
        $this->success = true;

        $this->response($this->success, $this->message);
    }

    private function delete_orders()
    {
        $order_ids = isset($_POST['order_ids']) ? json_decode($_POST['order_ids'], true) : [];

        foreach ($order_ids as $order_id) {
            $this->database->delete("orders", ["id" => $order_id]);
        }

        $notification_message = [
            "title" => "Success!",
            "text" => "Selected orders deleted successfully.",
            "icon" => "success",
        ];

        $this->success = true;

        session("notification", $notification_message);

        $this->response($this->success, $this->message);
    }

    private function place_orders()
    {
        $order_ids = explode(",", post("order_ids"));

        foreach ($order_ids as $order_id) {
            $data = [
                "status" => "Placed",
                "updated_at" => date("Y-m-d H:i:s"),
            ];

            $this->database->update("orders", $data, ["id" => $order_id]);
        }

        $notification_message = [
            "title" => "Success!",
            "text" => "The selected orders have been placed successfully.",
            "icon" => "success",
        ];

        session("notification", $notification_message);

        $this->success = true;

        $this->response($this->success, $order_ids);
    }

    private function get_conversation_data()
    {
        $id = post("id");

        $sql = "SELECT * FROM conversations WHERE sender_id = ? OR receiver_id = ? ORDER BY created_at ASC";

        $conversations = $this->database->query($sql, [$id, $id]);

        $formatted_conversations = [];

        if ($conversations) {
            foreach ($conversations as $conversation) {
                if (!isset($formatted_conversations[$id])) {
                    $formatted_conversations[$id] = [];
                }

                $formatted_conversations[$id][] = [
                    "user_id" => $conversation['sender_id'],
                    "message" => $conversation['message']
                ];
            }
        }

        $this->success = true;
        $this->message = $formatted_conversations;

        $this->response($this->success, $this->message);
    }

    private function get_unread_count()
    {
        $user_id = post("user_id");

        $unread_messages = count($this->database->select_many("conversations", ["sender_id" => 1, "receiver_id" => $user_id, "read_status" => "unread"]));

        if ($unread_messages) {
            $this->success = true;
            $this->message = $unread_messages;
        }

        $this->response($this->success, $this->message);
    }
    
    private function mark_as_read()
    {
        $user_id = post("user_id");

        $data = [
            "read_status" => "read",
            "updated_at" => date("Y-m-d H:i:s"),
        ];

        $this->database->update("conversations", $data, ["sender_id" => 1, "receiver_id" => $user_id, "read_status" => "unread"]);

        $this->success = true;

        $this->response($this->success, $this->message);
    }

    private function insert_message()
    {
        $sender_id = intval(post("sender_id"));
        $receiver_id = intval(post("receiver_id"));
        $message = trim(post("message"));

        $data = [
            "uuid" => $this->database->generate_uuid(),
            "sender_id" => $sender_id,
            "receiver_id" => $receiver_id,
            "message" => $message,
            "created_at" => date("Y-m-d H:i:s"),
        ];

        $this->database->insert("conversations", $data);

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
