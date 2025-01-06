<?php

/**
 * Manages session data by setting, getting, or unsetting session variables.
 * 
 * - If both `$key` and `$value` are provided, the function sets the session variable.
 * - If only `$key` is provided, the function returns the value of the session variable if it exists.
 * - If `$key` is provided and `$value` is `"unset"`, it unsets the session variable.
 * - If neither parameter is provided, it returns all session data.
 * 
 * @param string|null $key   The session key to set, get, or unset.
 * @param mixed|null  $value The value to set for the session key. If `"unset"`, the function will unset the session variable.
 * 
 * @return mixed|null Returns the value of the session variable if getting, true if setting/unsetting was successful, or null if the key does not exist.
 */
function session(string $key = null, $value = null)
{
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    if ($key !== null && $value === "unset") {
        unset($_SESSION[$key]);

        return true;
    }

    if ($key !== null && $value !== null) {
        $_SESSION[$key] = $value;

        return true;
    }

    if ($key !== null) {
        return isset($_SESSION[$key]) ? $_SESSION[$key] : null;
    }

    return $_SESSION;
}

/**
 * Retrieves a value from the $_POST superglobal.
 * 
 * - If `$key` is provided, returns the sanitized value of the specific POST variable.
 * - If `$key` is null, returns all sanitized $_POST data as an associative array.
 * 
 * @param string|null $key The key of the POST variable to retrieve.
 * 
 * @return mixed|null Returns the sanitized value of the POST variable, or null if it doesn't exist.
 */
function post(string $key = null)
{
    if ($key !== null) {
        return isset($_POST[$key]) ? htmlspecialchars($_POST[$key], ENT_QUOTES, 'UTF-8') : null;
    }

    $sanitizedData = [];

    foreach ($_POST as $k => $value) {
        $sanitizedData[$k] = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
    }

    return $sanitizedData;
}

/**
 * Retrieves a value from the $_GET superglobal.
 * 
 * - If `$key` is provided, returns the sanitized value of the specific GET variable.
 * - If `$key` is null, returns all sanitized $_GET data as an associative array.
 * 
 * @param string|null $key The key of the GET variable to retrieve.
 * 
 * @return mixed|null Returns the sanitized value of the GET variable, or null if it doesn't exist.
 */
function get(string $key = null)
{
    if ($key !== null) {
        return isset($_GET[$key]) ? htmlspecialchars($_GET[$key], ENT_QUOTES, 'UTF-8') : null;
    }

    $sanitizedData = [];

    foreach ($_GET as $k => $value) {
        $sanitizedData[$k] = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
    }

    return $sanitizedData;
}

/**
 * Retrieves or sets file information in the $_FILES superglobal.
 * 
 * - If `$key` is provided, returns the specific file data array for that key, or allows setting data if `$value` is provided.
 * - If `$key` is null, returns all file data in $_FILES as an associative array.
 * - This function does not upload or move the file; it only gets or sets file information.
 * 
 * @param string|null $key The key of the file input to retrieve or set.
 * @param array|null $value Optional. The file data to set if you're adding to $_FILES.
 * 
 * @return array|null Returns the file data array, or null if the key doesn't exist or if setting.
 */
function file_data(string $key = null, array $value = null)
{
    if ($value !== null) {
        $_FILES[$key] = $value;

        return null;
    }

    if ($key !== null) {
        return isset($_FILES[$key]) ? $_FILES[$key] : null;
    }

    return $_FILES;
}

/**
 * Checks if the website is running on localhost or offline.
 *
 * This function determines if the current environment is localhost by
 * checking the server's IP address. It can be used globally to configure
 * behaviors for local or development environments.
 *
 * @return bool Returns true if the website is running on localhost, false otherwise.
 */
function is_localhost()
{
    $whitelist = ['127.0.0.1', '::1'];

    return in_array($_SERVER['REMOTE_ADDR'], $whitelist);
}

/**
 * Redirects the user to a specified URL.
 *
 * This function performs a redirection to a given URL and stops
 * the script execution afterward.
 *
 * @param string $url The URL to redirect to.
 * @param int $statusCode (Optional) HTTP status code for the redirection. Default is 302 (temporary redirect).
 * @return void
 */
function redirect(string $url, int $statusCode = 302)
{
    http_response_code($statusCode);

    header("Location: " . $url);

    exit();
}

/**
 * Handles file uploads by resizing large images and converting them to WebP format
 * to improve website loading speed.
 *
 * @param string $file The name of the file input in the $_FILES array.
 * @param string $path The directory path where the file should be uploaded.
 *
 * @return string|false The unique filename of the WebP image if the upload is successful, or `false` if it fails.
 */
function upload(string $file, string $path)
{
    // Check if the file is uploaded
    if (isset($_FILES[$file])) {
        $fileInfo = $_FILES[$file];

        // Check for upload errors
        if ($fileInfo['error'] === UPLOAD_ERR_OK) {
            $filename = $fileInfo['name']; // Original filename
            $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION)); // File extension

            // Allowed image file types
            $allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

            if (!in_array($ext, $allowedTypes)) {
                return false; // Invalid file type
            }

            // Generate a unique filename for the WebP image
            $uniqueName = uniqid('file_', true) . '.webp';
            $uploadPath = rtrim($path, '/') . '/' . $uniqueName;

            // Get original image dimensions
            list($originalWidth, $originalHeight) = getimagesize($fileInfo['tmp_name']);

            // Load the uploaded image into memory
            switch ($ext) {
                case 'jpg':
                case 'jpeg':
                    $sourceImage = imagecreatefromjpeg($fileInfo['tmp_name']);
                    break;
                case 'png':
                    $sourceImage = imagecreatefrompng($fileInfo['tmp_name']);
                    break;
                case 'gif':
                    $sourceImage = imagecreatefromgif($fileInfo['tmp_name']);
                    break;
                case 'webp':
                    $sourceImage = imagecreatefromwebp($fileInfo['tmp_name']);
                    break;
                default:
                    return false; // Unsupported format
            }

            if (!$sourceImage) {
                return false; // Failed to create image resource
            }

            // Set maximum dimensions (adjust as needed)
            $maxWidth = 1200; // Maximum width
            $maxHeight = 1200; // Maximum height

            // Calculate new dimensions while maintaining aspect ratio
            $resizeRatio = min($maxWidth / $originalWidth, $maxHeight / $originalHeight, 1);
            $newWidth = (int)($originalWidth * $resizeRatio);
            $newHeight = (int)($originalHeight * $resizeRatio);

            // Create a new blank image with the desired dimensions
            $resizedImage = imagecreatetruecolor($newWidth, $newHeight);

            // Preserve transparency for PNG, GIF, and WebP
            if (in_array($ext, ['png', 'gif', 'webp'])) {
                imagealphablending($resizedImage, false);
                imagesavealpha($resizedImage, true);
            }

            // Copy and resize the original image into the new image
            imagecopyresampled(
                $resizedImage,
                $sourceImage,
                0,
                0,
                0,
                0,
                $newWidth,
                $newHeight,
                $originalWidth,
                $originalHeight
            );

            // Convert the resized image to WebP format and save it
            if (imagewebp($resizedImage, $uploadPath, 80)) { // 80 is the quality (adjust as needed)
                // Free memory
                imagedestroy($sourceImage);
                imagedestroy($resizedImage);

                return $uniqueName; // Return the WebP filename
            }

            // Free memory in case of failure
            imagedestroy($sourceImage);
            imagedestroy($resizedImage);
        }
    }

    return false; // Return false if upload fails
}

/**
 * Generates a semantic version number.
 *
 * - The major version is incremented every 100 commits.
 * - The minor version increments every 10 commits within the current major cycle.
 * - The patch version increments for each commit within the current minor cycle.
 *
 * @return string The semantic version string in the format "major.minor.patch".
 */
function version()
{
    $major = 0;
    $minor = 1;
    $patch = 16;

    return "$major.$minor.$patch";
}
