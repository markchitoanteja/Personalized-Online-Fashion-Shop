<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

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
function session($key = null, $value = null)
{
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
function post($key = null)
{
    if ($key !== null) {
        // Return specific sanitized POST variable if key exists, or null
        return isset($_POST[$key]) ? htmlspecialchars($_POST[$key], ENT_QUOTES, 'UTF-8') : null;
    }

    // If no key is specified, return all sanitized $_POST data
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
function get($key = null)
{
    if ($key !== null) {
        // Return specific sanitized GET variable if key exists, or null
        return isset($_GET[$key]) ? htmlspecialchars($_GET[$key], ENT_QUOTES, 'UTF-8') : null;
    }

    // If no key is specified, return all sanitized $_GET data
    $sanitizedData = [];
    foreach ($_GET as $k => $value) {
        $sanitizedData[$k] = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
    }
    return $sanitizedData;
}
