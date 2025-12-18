<?php $page_name = "products";

// Include header
require_once __DIR__ . "/header.php";
?>

<!-- Products Management Page -->
<h1>Manage Products</h1>

<!-- Products Table -->
<table border="1" cellpadding="10" cellspacing="0">
    <thead>
        <tr>
            <!-- Table Headers -->
            <th>product_id</th>
            <th>SKU</th>
            <th>Name</th>
            <th>id_category</th>
            <th>Active</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
        </tr>
    </thead>

    <!-- Table Body for Products -->
    <tbody id="products-table-body">

        <!-- The Products get rendered here dynamically -->
    </tbody>
    <tbody>
        <tr>

            <!-- Input fields for adding a new product -->
            <td></td>
            <td><input type="text" id="new-sku" placeholder="SKU" style="width: 60px"></td>
            <td><input type="text" id="new-name" placeholder="Name" style="width: 140px"></td>
            <td><input type="number" id="new-category-id" placeholder="Category ID" style="width: 60px"></td>
            <td><input type="number" id="new-active" placeholder="0/1" style="width: 50px"></td>
            <td><input type="number" id="new-price" placeholder="Price" style="width: 80px"></td>
            <td><input type="number" id="new-stock" placeholder="Stock" style="width: 60px"></td>
            <td>
                <button class="add-product-btn">Add Product</button>
            </td>
        </tr>
    </tbody>
</table>

<!-- Include JavaScript controllers -->
<script src="/controller/auth-guard.js"></script>
<script src="/controller/products-controller.js"></script>

<!-- Include footer -->
<?php require_once __DIR__ . "/footer.php"; ?>