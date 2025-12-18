<?php
// The Validator class for input validation
class Validator
{
    // Validate category data
    public static function validateCategory(array $data): array
    {
        $errors = [];
        // Validate 'active' field, must be 0 or 1
        if (!isset($data['active']) || !preg_match('/^[01]$/', (string) $data['active'])) {
            $errors[] = "Active must be 0 or 1.";
        }

        // Validate 'name' field, must be alphanumeric and max 20 chars
        if (
            empty($data['name']) ||
            !preg_match('/^[a-zA-Z0-9]{1,20}$/', $data['name'])
        ) {
            $errors[] = "Name must contain only letters and numbers (max 20 characters).";
        }

        return $errors;
    }

    // Validate product data
    public static function validateProduct(array $data, mysqli $conn): array
    {
        $errors = [];

        // Validate 'sku' field, must be alphanumeric and max 10 chars
        if (
            empty($data['sku']) ||
            !preg_match('/^[a-zA-Z0-9]{1,10}$/', $data['sku'])
        ) {
            $errors[] = "SKU must contain only letters and numbers (max 10 characters).";
        }

        // Validate 'name' field, must be alphanumeric and max 20 chars
        if (
            empty($data['name']) ||
            !preg_match('/^[a-zA-Z0-9]{1,20}$/', $data['name'])
        ) {
            $errors[] = "Name must contain only letters and numbers (max 20 characters).";
        }

        //  Validate 'id_category' field, must exist in 'category' table
        if (!isset($data['id_category']) || !ctype_digit((string) $data['id_category'])) {
            $errors[] = "Category ID must be a valid integer.";
        } else {

            // Prepare and execute query to check if category exists
            $stmt = $conn->prepare("SELECT category_id FROM category WHERE category_id = ?");

            // Bind parameter and execute
            $stmt->bind_param("i", $data['id_category']);

            // Execute the statement
            $stmt->execute();

            // Store the result
            $stmt->store_result();

            // Check if category exists
            if ($stmt->num_rows === 0) {
                $errors[] = "Category does not exist.";
            }
        }

        // Validate 'active' field, must be 0 or 1
        if (!isset($data['active']) || !preg_match('/^[01]$/', (string) $data['active'])) {
            $errors[] = "Active must be 0 or 1.";
        }

        // Validate 'price' field, must be a positive number
        if (
            !isset($data['price']) ||
            !is_numeric($data['price']) ||
            (float) $data['price'] < 0
        ) {
            $errors[] = "Price must be a positive number.";
        }

        // Validate 'stock' field, must be a positive integer
        if (
            !isset($data['stock']) ||
            !ctype_digit((string) $data['stock'])
        ) {
            $errors[] = "Stock must be a positive integer.";
        }

        return $errors;
    }
}
