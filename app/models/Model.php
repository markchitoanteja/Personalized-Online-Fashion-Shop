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
        $this->create_customers_table();
        $this->create_products_table();
        $this->create_orders_table();
        $this->create_system_updates_table();
        $this->create_newsletter_contacts_table();
        $this->create_contact_messages_table();
        $this->create_conversations_table();
        $this->create_notification_settings_table();
        $this->insert_admin_data();
        $this->insert_notification_settings_data();

        $this->check_addresses_table();

        // Manually import the following tables: ph_address_regions, ph_address_provinces, ph_address_cities_municipalities, ph_address_barangays
        // They are located in the public/backup folder
    }

    private function check_addresses_table()
    {
        $sql_1 = "SELECT 1 FROM ph_address_regions LIMIT 1";
        $sql_2 = "SELECT 1 FROM ph_address_provinces LIMIT 1";
        $sql_3 = "SELECT 1 FROM ph_address_cities_municipalities LIMIT 1";
        $sql_4 = "SELECT 1 FROM ph_address_barangays LIMIT 1";

        if (!$this->connection->query($sql_1) === FALSE && !$this->connection->query($sql_2) === FALSE && !$this->connection->query($sql_3) === FALSE && !$this->connection->query($sql_4) === FALSE) {
            return true;
        } else {
            die("Manually import the following tables: ph_address_regions, ph_address_provinces, ph_address_cities_municipalities, ph_address_barangays");

            return false;
        }
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
            user_type ENUM('developer', 'admin', 'customer') NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )";

        if (!$this->connection->query($sql) === TRUE) {
            die("Error creating users table: " . $this->connection->error);
        }
    }

    private function create_customers_table()
    {
        $sql = "CREATE TABLE IF NOT EXISTS customers (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            uuid CHAR(36) NOT NULL UNIQUE,
            user_id INT NOT NULL UNIQUE,
            first_name VARCHAR(30) NOT NULL,
            middle_name VARCHAR(30) NOT NULL,
            last_name VARCHAR(30) NOT NULL,
            birthday VARCHAR(10) NOT NULL,
            email VARCHAR(30) NOT NULL UNIQUE,
            mobile_number VARCHAR(11) NOT NULL,
            region VARCHAR(255) NOT NULL,
            province VARCHAR(255) NOT NULL,
            city_municipality VARCHAR(255) NOT NULL,
            barangay VARCHAR(255) NOT NULL,
            address TEXT NOT NULL,
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
            name VARCHAR(255) NOT NULL,
            category VARCHAR(11) NOT NULL,
            price FLOAT(11,2) NOT NULL,
            image VARCHAR(255) NOT NULL,
            is_customer_added TINYINT DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )";

        if (!$this->connection->query($sql) === TRUE) {
            die("Error creating users table: " . $this->connection->error);
        }
    }

    private function create_orders_table()
    {
        $sql = "CREATE TABLE IF NOT EXISTS orders (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            uuid CHAR(36) NOT NULL UNIQUE,
            user_id INT UNSIGNED NOT NULL,
            product_id INT UNSIGNED NOT NULL,
            quantity INT UNSIGNED NOT NULL,
            total_price FLOAT(11,2) NOT NULL,
            status VARCHAR(20) DEFAULT 'pending',
            request_cancel TINYINT DEFAULT 0,
            is_custom_order TINYINT DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )";

        if (!$this->connection->query($sql) === TRUE) {
            die("Error creating orders table: " . $this->connection->error);
        }
    }

    private function create_system_updates_table()
    {
        $sql = "CREATE TABLE IF NOT EXISTS system_updates (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            uuid CHAR(36) NOT NULL UNIQUE,
            system_update TEXT NOT NULL,
            status ENUM('read', 'unread') NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )";

        if (!$this->connection->query($sql) === TRUE) {
            die("Error creating orders table: " . $this->connection->error);
        }
    }

    private function create_newsletter_contacts_table()
    {
        $sql = "CREATE TABLE IF NOT EXISTS newsletter_contacts (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            uuid CHAR(36) NOT NULL UNIQUE,
            name VARCHAR (100) NOT NULL,
            email VARCHAR (100) NOT NULL UNIQUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )";

        if (!$this->connection->query($sql) === TRUE) {
            die("Error creating orders table: " . $this->connection->error);
        }
    }

    private function create_contact_messages_table()
    {
        $sql = "CREATE TABLE IF NOT EXISTS contact_messages (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            uuid CHAR(36) NOT NULL UNIQUE,
            name VARCHAR (100) NOT NULL,
            email VARCHAR (100) NOT NULL,
            message TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )";

        if (!$this->connection->query($sql) === TRUE) {
            die("Error creating orders table: " . $this->connection->error);
        }
    }

    private function create_conversations_table()
    {
        $sql = "CREATE TABLE IF NOT EXISTS conversations (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            uuid CHAR(36) NOT NULL,
            sender_id INT(11) NOT NULL,
            receiver_id INT(11) NOT NULL,
            message TEXT NOT NULL,
            read_status ENUM('unread', 'read') DEFAULT 'unread',  -- Add this column for read/unread status
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )";

        if (!$this->connection->query($sql) === TRUE) {
            die("Error creating conversations table: " . $this->connection->error);
        }
    }
    
    private function create_notification_settings_table()
    {
        $sql = "CREATE TABLE IF NOT EXISTS notification_settings (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            uuid CHAR(36) NOT NULL,
            read_status ENUM('unread', 'read') DEFAULT 'unread',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )";

        if (!$this->connection->query($sql) === TRUE) {
            die("Error creating conversations table: " . $this->connection->error);
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
    
    private function insert_notification_settings_data()
    {
        $is_data_exists = $this->database->select_one("notification_settings", ["id" => "1"]);

        if (!$is_data_exists) {
            $data = [
                "uuid" => $this->database->generate_uuid(),
                "read_status" => 'read',
                "created_at" => date('Y-m-d H:i:s'),
                "updated_at" => date('Y-m-d H:i:s'),
            ];

            $this->database->insert("notification_settings", $data);
        }
    }
}
