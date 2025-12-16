<?php

class TaskController
{
    // Database connection instance
    private mysqli $conn;

    // Constructor to initialize the database connection
    public function __construct(mysqli $conn)
    {
        // Set the database connection instance
        $this->conn = $conn;
    }

    //Products------------------------------------------------------------------------
    //Get a List of all the products in the table
    public function listProducts(): array
    {
        // Query to select all products
        $sql = "SELECT * FROM product";
        $res = $this->conn->query($sql);
        $rows = [];

        if ($res) {
            // Fetch all products and store them in an array
            while ($r = $res->fetch_assoc()) {
                $rows[] = $r;
            }
        }

        // Return the list of products as array (Slim outputs JSON)
        return $rows;
    }

    //Get Info from product by a ID
    public function getProduct(int $id): array|null
    {
        // Prepare a SQL statement to select a product by ID
        $stmt = $this->conn->prepare("SELECT * FROM product WHERE product_id = ?");
        $stmt->bind_param('i', $id);
        $stmt->execute();

        // Fetch the product data
        $res = $stmt->get_result()->fetch_assoc();

        // Return product or null if not found
        return $res ?: null;
    }

    //Create a new product (still don't know what "sku" is)
    public function createProduct(array $data): array
    {
        // Prepare a SQL statement to insert a new product
        $sql = "INSERT INTO product (sku, active, id_category, name, image, description, price, stock)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);

        // Bind parameters from the input data
        $sku = $data['sku'] ?? '';
        $active = $data['active'] ?? 1;
        $id_category = $data['id_category'] ?? null;
        $name = $data['name'] ?? '';
        $image = $data['image'] ?? '';
        $description = $data['description'] ?? '';
        $price = $data['price'] ?? 0;
        $stock = $data['stock'] ?? 0;

        // "siisssdii" = s-string, i-integer, d-double (Bind Parameter for my Table)
        $stmt->bind_param('siisssdi', $sku, $active, $id_category, $name, $image, $description, $price, $stock);

        // Execute the statement and check for success
        if ($stmt->execute()) {
            // Return the insert ID in JSON format
            return ['insertId' => $stmt->insert_id];
        }

        // Return error message in JSON format
        return ['error' => $stmt->error];
    }

    //Alter a Product chosen by ID
    public function updateProduct(int $id, array $data): array
    {
        // Prepare a SQL statement to update a product by ID
        $sql = "UPDATE product SET sku=?, active=?, id_category=?, name=?, image=?, description=?, price=?, stock=? 
                WHERE product_id=?";
        $stmt = $this->conn->prepare($sql);

        $sku = $data['sku'] ?? '';
        $active = $data['active'] ?? 1;
        $id_category = $data['id_category'] ?? null;
        $name = $data['name'] ?? '';
        $image = $data['image'] ?? '';
        $description = $data['description'] ?? '';
        $price = $data['price'] ?? 0;
        $stock = $data['stock'] ?? 0;

        // "siisssdii" = s-string, i-integer, d-double (Bind Parameter for my Table)
        $stmt->bind_param('siisssdii', $sku, $active, $id_category, $name, $image, $description, $price, $stock, $id);

        if ($stmt->execute()) {
            // Return the number of affected rows
            return ['affected' => $stmt->affected_rows];
        }

        // Return error message in JSON format
        return ['error' => $stmt->error];
    }

    //Delete a Product by ID
    public function deleteProduct(int $id): array
    {
        // Prepare a SQL statement to delete a product by ID
        $stmt = $this->conn->prepare("DELETE FROM product WHERE product_id = ?");
        $stmt->bind_param('i', $id);

        // Execute and check for success
        if ($stmt->execute()) {
            // Return number of deleted rows
            return ['deleted' => $stmt->affected_rows];
        }

        // Return error
        return ['error' => $stmt->error];
    }

    //Category------------------------------------------------------------------------

    public function listCategories(): array
    {
        //Query to select all categories
        $sql = "SELECT * FROM category";
        $res = $this->conn->query($sql);

        $rows = [];

        //Fetch all categories and store them in an array
        if ($res) {
            while ($r = $res->fetch_assoc()) {
                $rows[] = $r;
            }
        }

        // Return as array (Slim handles JSON output)
        return $rows;
    }

    //Get Info from category by a ID
    public function getCategory(int $id): array|null
    {
        //Prepare a SQL statement to select a category by ID
        $stmt = $this->conn->prepare("SELECT * FROM category WHERE category_id = ?");
        $stmt->bind_param('i', $id);
        $stmt->execute();

        //Fetch the category data
        $res = $stmt->get_result()->fetch_assoc();

        //Return category or null
        return $res ?: null;
    }

    //Create a new category
    public function createCategory(array $data): array
    {
        //Prepare a SQL statement to insert a new category
        $active = $data['active'] ?? 1;
        $name = $data['name'] ?? '';

        $stmt = $this->conn->prepare("INSERT INTO category (active, name) VALUES (?, ?)");
        $stmt->bind_param('is', $active, $name);

        if ($stmt->execute()) {
            // Return insert ID
            return ['insertId' => $stmt->insert_id];
        }

        // Return error
        return ['error' => $stmt->error];
    }

    //Alter a category chosen by ID
    public function updateCategory(int $id, array $data): array
    {
        //Prepare a SQL statement to update a category by ID
        $active = $data['active'] ?? 1;
        $name = $data['name'] ?? '';

        $stmt = $this->conn->prepare("UPDATE category SET active=?, name=? WHERE category_id=?");
        $stmt->bind_param('isi', $active, $name, $id);

        if ($stmt->execute()) {
            //Return number of affected rows
            return ['affected' => $stmt->affected_rows];
        }

        //Return error
        return ['error' => $stmt->error];
    }

    //Delete a category by ID
    public function deleteCategory(int $id): array
    {
        //Prepare a SQL statement to delete a category by ID
        $stmt = $this->conn->prepare("DELETE FROM category WHERE category_id=?");
        $stmt->bind_param('i', $id);

        if ($stmt->execute()) {
            //Return number of deleted rows
            return ['deleted' => $stmt->affected_rows];
        }

        //Return error
        return ['error' => $stmt->error];
    }
}
