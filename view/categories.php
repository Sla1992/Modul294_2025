<?php $page_name = "categories";
require_once __DIR__ . "/header.php"; ?>


<h1>Manage Categories</h1>

<table border="1" cellpadding="10" cellspacing="0">
    <thead>
        <tr>
            <th>Category ID</th>
            <th>Active</th>
            <th>Name</th>
            <th>Actions</th>
        </tr>
    </thead>

    <tbody id="categories-table-body">
        <!-- The Categories get rendered here dynamically -->
    </tbody>

    <tbody>
        <tr>
            <td></td>
            <td><input type="number" id="new-active" placeholder="0/1" style="width: 50px"></td>
            <td><input type="text" id="new-name" placeholder="Name" style="width: 140px"></td>
            <td>
                <button class="add-category-btn">Add Category</button>
            </td>
        </tr>
    </tbody>

</table>

<script src="/controller/auth-guard.js"></script>
<script src="/controller/categories-controller.js"></script>

<?php require_once __DIR__ . "/footer.php"; ?>