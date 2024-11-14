<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Print Order</title>
    <style>
        /* General styling */
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }

        .receipt-container {
            max-width: 600px;
            margin: auto;
            padding: 20px;
            border: 1px solid #ddd;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .header img {
            max-width: 80px;
            margin-bottom: 10px;
        }

        h2 {
            text-align: center;
            margin-bottom: 10px;
        }

        .order-summary,
        .order-details,
        .qr-code {
            margin: 20px 0;
        }

        .order-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
        }

        .order-item strong {
            color: #555;
        }

        .total-price {
            font-size: 1.2em;
            font-weight: bold;
        }

        .qr-code {
            text-align: center;
            margin-top: 20px;
        }

        .print-button-container {
            text-align: center;
            margin-top: 20px;
        }

        .print-button {
            padding: 10px 20px;
            font-size: 16px;
            color: #fff;
            background-color: #28a745;
            border: none;
            cursor: pointer;
            border-radius: 5px;
        }

        .print-button:hover {
            background-color: #218838;
        }
    </style>
</head>

<body>
    <div class="receipt-container">
        <!-- Header Section with Logo -->
        <div class="header">
            <img src="../assets/images/logo-light.png" alt="Company Logo">
            <h2>Order Receipt</h2>
            <p>Thank you for shopping with us!</p>
        </div>

        <?php
        $database = new Database();

        // Get order_id from query string and fetch order details
        $order_id = $_GET['order_id'] ?? null;
        if ($order_id) {
            $order = $database->select_one("orders", ["id" => $order_id]);
            if ($order) {
                $user = $database->select_one("users", ["id" => $order["user_id"]]);
                $product = $database->select_one("products", ["id" => $order["product_id"]]);
        ?>
                <!-- Order Summary Section -->
                <div class="order-summary">
                    <div class="order-item"><strong>Order ID:</strong> <span><?= str_pad($order["id"], 5, "0", STR_PAD_LEFT) ?></span></div>
                    <div class="order-item"><strong>Order Date:</strong> <span><?= date("F j, Y", strtotime($order["created_at"])) ?></span></div>
                    <div class="order-item"><strong>Customer Name:</strong> <span><?= $user["name"] ?></span></div>
                </div>

                <!-- Order Details Section -->
                <h3>Order Details</h3>
                <div class="order-details">
                    <div class="order-item"><strong>Product Name:</strong> <span><?= $product["name"] ?></span></div>
                    <div class="order-item"><strong>Quantity:</strong> <span><?= $order["quantity"] ?></span></div>
                    <div class="order-item"><strong>Total Price:</strong> <span class="total-price">₱ <?= $order["total_price"] ?></span></div>
                    <div class="order-item"><strong>Status:</strong> <span><?= ucfirst($order["status"]) ?></span></div>
                </div>

                <!-- QR Code Section -->
                <div class="qr-code">
                    <?php
                    $uuid = $order["uuid"];
                    echo "<img src='https://api.qrserver.com/v1/create-qr-code/?size=150x150&data={$uuid}' alt='QR Code'>";
                    ?>
                    <p>Scan this QR code for order verification</p>
                </div>

                <!-- Print Button -->
                <div class="print-button-container">
                    <button class="print-button" onclick="window.print()">Print Receipt</button>
                </div>

        <?php
            } else {
                echo "<p>Order not found.</p>";
            }
        } else {
            echo "<p>Invalid order ID.</p>";
        }
        ?>
    </div>
</body>

</html>