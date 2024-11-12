<?php
class Model
{
    private $database;
    private $connection;

    public function __construct()
    {
        $this->database = new Database();
        $this->connection = $this->database->connect();

        $this->create_users_table();
        $this->create_products_table();
        $this->insert_admin_data();
    }

    private function create_users_table()
    {
        $sql = "CREATE TABLE IF NOT EXISTS users (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            uuid CHAR(36) NOT NULL UNIQUE,
            name VARCHAR(100) NOT NULL,
            username VARCHAR(50) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            image VARCHAR(255) NOT NULL,
            user_type ENUM('admin', 'customer') NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )";

        if (!$this->connection->query($sql) === TRUE) {
            die("Error creating users table: " . $this->connection->error);
        }
    }
    
    private function create_products_table()
    {
        $sql = "CREATE TABLE IF NOT EXISTS products (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            uuid CHAR(36) NOT NULL UNIQUE,
            name VARCHAR(100) NOT NULL,
            category VARCHAR(10) NOT NULL,
            price FLOAT(11,2) NOT NULL,
            image VARCHAR(255) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )";

        if (!$this->connection->query($sql) === TRUE) {
            die("Error creating users table: " . $this->connection->error);
        }
    }

    private function insert_admin_data()
    {
        $is_admin_exists = $this->database->select_one("users", ["id" => "1"]);

        if (!$is_admin_exists) {
            $data = [
                "uuid" => $this->database->generate_uuid(),
                "name" => 'Administrator',
                "username" => 'admin',
                "password" => password_hash('admin123', PASSWORD_BCRYPT),
                "image" => 'default-user-image.png',
                "user_type" => 'admin',
                "created_at" => date('Y-m-d H:i:s'),
                "updated_at" => date('Y-m-d H:i:s'),
            ];

            $this->database->insert("users", $data);
        }
    }
}
