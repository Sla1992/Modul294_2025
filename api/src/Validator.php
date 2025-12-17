<?php

class Validator
{
    /* =====================================================
       CATEGORY VALIDATION
    ===================================================== */

    public static function validateCategory(array $data): array
    {
        $errors = [];

        // active: Pflicht, nur 0 oder 1
        if (!isset($data['active']) || !preg_match('/^[01]$/', (string) $data['active'])) {
            $errors[] = "Active must be 0 or 1.";
        }

        // name: Pflicht, nur Buchstaben & Zahlen, max. 20 Zeichen
        if (
            empty($data['name']) ||
            !preg_match('/^[a-zA-Z0-9]{1,20}$/', $data['name'])
        ) {
            $errors[] = "Name must contain only letters and numbers (max 20 characters).";
        }

        return $errors;
    }

    /* =====================================================
       PRODUCT VALIDATION
    ===================================================== */

    public static function validateProduct(array $data, mysqli $conn): array
    {
        $errors = [];

        // SKU: Pflicht, Buchstaben & Zahlen, max. 10 Zeichen
        if (
            empty($data['sku']) ||
            !preg_match('/^[a-zA-Z0-9]{1,10}$/', $data['sku'])
        ) {
            $errors[] = "SKU must contain only letters and numbers (max 10 characters).";
        }

        // Name: Pflicht, Buchstaben & Zahlen, max. 20 Zeichen
        if (
            empty($data['name']) ||
            !preg_match('/^[a-zA-Z0-9]{1,20}$/', $data['name'])
        ) {
            $errors[] = "Name must contain only letters and numbers (max 20 characters).";
        }

        // id_category: Pflicht, Integer, muss existieren
        if (!isset($data['id_category']) || !ctype_digit((string) $data['id_category'])) {
            $errors[] = "Category ID must be a valid integer.";
        } else {
            $stmt = $conn->prepare("SELECT category_id FROM category WHERE category_id = ?");
            $stmt->bind_param("i", $data['id_category']);
            $stmt->execute();
            $stmt->store_result();

            if ($stmt->num_rows === 0) {
                $errors[] = "Category does not exist.";
            }
        }

        // active: Pflicht, nur 0 oder 1
        if (!isset($data['active']) || !preg_match('/^[01]$/', (string) $data['active'])) {
            $errors[] = "Active must be 0 or 1.";
        }

        // price: Pflicht, Zahl >= 0, Kommazahlen erlaubt
        if (
            !isset($data['price']) ||
            !is_numeric($data['price']) ||
            (float) $data['price'] < 0
        ) {
            $errors[] = "Price must be a positive number.";
        }

        // stock: Pflicht, Ganzzahl >= 0
        if (
            !isset($data['stock']) ||
            !ctype_digit((string) $data['stock'])
        ) {
            $errors[] = "Stock must be a positive integer.";
        }

        return $errors;
    }
}
