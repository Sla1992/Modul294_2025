// Array with valid category IDs for validation
let validCategoryIds = [];
// On DOM load, fetch products and categories, apply filters, and render
document.addEventListener("DOMContentLoaded", async () => {

    try {
        
        // Fetch categories to get valid IDs
        const categories = await authFetch("http://localhost/api/public/categories");
        validCategoryIds = categories.map(c => Number(c.category_id));
        window.validCategoryIds = validCategoryIds;
        
        // Fetch products
        const products = await authFetch("http://localhost/api/public/products");
       
        // Get filters from URL
        const filters = getFiltersFromUrl();
        
        // Apply filters to products
        const filteredProducts = applyFilters(products, filters);
        
        // Render products and bind add product button
        renderProducts(filteredProducts);
        bindAddProduct();
        
        // Handle case with no categories
    } catch (error) {
        console.error(error.message);
        showToast("Produkte konnten nicht geladen werden", "error");
    }
});

// Extract filters from URL parameters
function getFiltersFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const filters = {};

    // Iterate over URL parameters to build filters object
    for (const [key, value] of params.entries()) {
        if (key === "page") continue;
        filters[key] = value;
    }

    //  Return constructed filters
    return filters;
}

// Apply filters to products based on URL parameters
function applyFilters(products, filters) {
    if (Object.keys(filters).length === 0) return products;

    // Filter products array
    return products.filter(product => {
        return Object.entries(filters).every(([key, value]) => {
            if (!(key in product)) return false;

            // Handle numeric and string comparisons
            if (!isNaN(product[key]) && !isNaN(value)) {
                return Number(product[key]) === Number(value);
            }

            // Case-insensitive string comparison
            return String(product[key]).toLowerCase() === String(value).toLowerCase();
        });
    });
}

// Render products in the table
function renderProducts(products) {
    const tableBody = document.querySelector("#products-table-body");
    if (!tableBody) return;

    // Clear existing rows
    tableBody.innerHTML = "";

    // Handle case with no products
    if (products.length === 0) {
        showToast("Keine Produkte gefunden", "info");
        return;
    }

    // Create and append rows for each product
    products.forEach(product => {
        tableBody.appendChild(createProductRow(product));
    });
}

// Create a table row for a product
function createProductRow(product) {
    const row = document.createElement("tr");
    row.dataset.id = product.product_id;

    // Append table cells with product data
    row.append(
        td(product.product_id),
        td(product.sku),
        td(product.name),
        td(product.id_category),
        td(product.active),
        td(`CHF ${Number(product.price).toFixed(2)}`),
        td(product.stock),
        actionsTd(product, row)
    );

    return row;
}

// Create action buttons for a product row
function actionsTd(product, row) {
    const td = document.createElement("td");

    // Delete button
    const del = document.createElement("button");
    del.textContent = "Delete";
    del.onclick = () => deleteProduct(product.product_id, row);

    // Edit button
    const edit = document.createElement("button");
    edit.textContent = "Edit";
    edit.onclick = () => editProduct(product, row);

    // Append buttons to action cell
    td.append(del, edit);
    return td;
}

// Delete a product with confirmation and optimistic UI update
async function deleteProduct(id, row) {
    if (!confirm("Produkt wirklich löschen?")) return;

    // Optimistic UI: remove row immediately
    row.remove();

    // Attempt to delete product from server
    try {
        await authFetch(`http://localhost/api/public/products/${id}`, {
            method: "DELETE"
        });

        // Message on successful deletion
        showToast("Produkt gelöscht", "success");
    } catch {

        // Message on failure
        showToast("Löschen fehlgeschlagen", "error");
    }
}

// Bind add product button to create new products
function bindAddProduct() {
    const btn = document.querySelector(".add-product-btn");
    if (!btn) return;

    // On button click, gather input values and validate
    btn.onclick = async () => {
        const product = {
            sku: value("new-sku"),
            name: value("new-name"),
            id_category: value("new-category-id"),
            active: value("new-active"),
            price: value("new-price"),
            stock: value("new-stock")
        };

        // Validate product data
        const errors = validateProduct(product, validCategoryIds);
        if (errors.length) {
            errors.forEach(err => showToast(err, "error"));
            return;
        }

        // Optimistic UI: add temporary row
        const tempRow = createProductRow({ ...product, product_id: "…" });
        document.querySelector("#products-table-body").prepend(tempRow);

        // Attempt to create product on server
        try {
            const res = await authFetch("http://localhost/api/public/products", {
                method: "POST",
                body: JSON.stringify(product)
            });

            // Update temporary row with real product ID
            tempRow.children[0].textContent = res.insertId;
            showToast("Produkt erstellt", "success");

        // Handle failure by removing temp row
        } catch {
            tempRow.remove();
            showToast("Produkt konnte nicht erstellt werden", "error");
        }
    };
}

// Helper to create a table cell with text
function td(text) {
    const td = document.createElement("td");
    td.textContent = text ?? "";
    return td;
}

// Helper to get trimmed value from input by ID
function value(id) {
    return document.getElementById(id)?.value.trim();
}
