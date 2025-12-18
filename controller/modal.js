// Simple modal implementation
function openModal(title, contentHtml, onSave) { 

    // Create modal elements
    const overlay = document.createElement("div");

    // Set class for styling
    overlay.className = "modal-overlay";

    // Set inner HTML
    overlay.innerHTML = `
        <div class="modal">
            <h3>${title}</h3>
            <div class="modal-body">${contentHtml}</div>
            <div class="modal-actions">
                <button class="cancel-btn">Cancel</button>
                <button class="save-btn">Save</button>
            </div>
        </div>
    `;

    // Append to body
    document.body.appendChild(overlay);

    // Cancel closes modal
    overlay.querySelector(".cancel-btn").onclick = () => overlay.remove();

    // Save handler
    overlay.querySelector(".save-btn").onclick = async () => {
        const shouldClose = await onSave();
        if (shouldClose !== false) overlay.remove();
    };
}

// Edit product with validation
window.editProduct = function (product, row) {
    const cells = row.children;

    // Open modal with product details
    openModal(
        "Produkt bearbeiten",
        `
            <label>SKU</label>
            <input id="edit-sku" value="${product.sku}">

            <label>Name</label>
            <input id="edit-name" value="${product.name}">

            <label>Category-ID</label>
            <input id="edit-id-category" value="${product.id_category}">

            <label>Active (0/1)</label>
            <input id="edit-active" value="${product.active}">

            <label>Price</label>
            <input id="edit-price" value="${product.price}">

            <label>Stock</label>
            <input id="edit-stock" value="${product.stock}">
        `,
        // Save handler with validation
        async () => {
            const updated = {
                sku: val("edit-sku"),
                name: val("edit-name"),
                id_category: val("edit-id-category"),
                active: val("edit-active"),
                price: val("edit-price"),
                stock: val("edit-stock")
            };

            // Validation
            const errors = validateProduct(updated, window.validCategoryIds || []);
            if (errors.length) {
                errors.forEach(err => showToast(err, "error"));
                return false;
            }

            // Optimistic UI
            cells[1].textContent = updated.sku;
            cells[2].textContent = updated.name;
            cells[3].textContent = updated.id_category;
            cells[4].textContent = updated.active;
            cells[5].textContent = `CHF ${Number(updated.price).toFixed(2)}`;
            cells[6].textContent = updated.stock;

            // Send update to server
            try {
                await authFetch(`http://localhost/api/public/products/${product.product_id}`, {
                    method: "PATCH",
                    body: JSON.stringify(updated)
                });
                showToast("Produkt aktualisiert", "success");
            } catch {
                showToast("Produkt konnte nicht aktualisiert werden", "error");
            }
        }
    );
};

//Category edit with validation
window.editCategory = function (category, row) {

    const cells = row.children;
    // Open modal with category details
    openModal(
        "Kategorie bearbeiten",
        `
            <label>Active (0/1)</label>
            <input id="edit-active" value="${category.active}">

            <label>Name</label>
            <input id="edit-name" value="${category.name}">
        `,
        // Save handler with validation
        async () => {

            // Gather updated values
            const updated = {
                active: val("edit-active"),
                name: val("edit-name")
            };

            // Validation
            const errors = validateCategory(updated);
            if (errors.length) {
                errors.forEach(err => showToast(err, "error"));
                return false; // ❌ keep modal open
            }

            // Optimistic UI
            cells[1].textContent = updated.active;
            cells[2].textContent = updated.name;

            // Send update to server
            try {
                await authFetch(`http://localhost/api/public/categories/${category.category_id}`, {
                    method: "PATCH",
                    body: JSON.stringify(updated)
                });
                showToast("Kategorie aktualisiert", "success");
            } catch {
                showToast("Kategorie konnte nicht aktualisiert werden", "error");
            }
        }
    );
};

// Helper to get trimmed value by ID
function val(id) {
    return document.getElementById(id)?.value.trim();
}
