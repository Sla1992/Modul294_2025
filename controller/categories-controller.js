// Listener for DOMContentLoaded to initialize category management
document.addEventListener("DOMContentLoaded", async () => {

    // Fetch and render categories
    try {

        // Fetch categories from API
        const categories = await authFetch("http://localhost/api/public/categories");

        // Get filters from URL
        const filters = getFiltersFromUrl();

        // Apply filters to categories
        const filteredCategories = applyFilters(categories, filters);

        // Render categories and bind add category button
        renderCategories(filteredCategories);
        bindAddCategory();

        //  Handle case with no categories
    } catch (error) {
        console.error(error.message);
        showToast("Kategorien konnten nicht geladen werden", "error");
    }
});

// Extract filters from URL parameters
function getFiltersFromUrl() {

    // Parse URL parameters
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

// Apply filters to categories based on URL parameters
function applyFilters(categories, filters) {
    if (Object.keys(filters).length === 0) return categories;

    // Filter categories array
    return categories.filter(category => {

        // Check each filter condition
        return Object.entries(filters).every(([key, value]) => {

            // Key must exist in category
            if (!(key in category)) return false;

            // Handle numeric and string comparisons
            if (!isNaN(category[key]) && !isNaN(value)) {
                return Number(category[key]) === Number(value);
            }

            // Case-insensitive string comparison
            return String(category[key]).toLowerCase() === String(value).toLowerCase();
        });
    });
}

// Render categories in the table
function renderCategories(categories) {

    // Get the table body element
    const tableBody = document.querySelector("#categories-table-body");
    if (!tableBody) return;

    // Clear existing rows
    tableBody.innerHTML = "";

    // Handle case with no categories
    if (categories.length === 0) {
        showToast("Keine Kategorien gefunden", "info");
        return;
    }

    // Create and append rows for each category
    categories.forEach(category => {
        tableBody.appendChild(createCategoryRow(category));
    });
}

// Create a table row for a category
function createCategoryRow(category) {
    const row = document.createElement("tr");
    row.dataset.id = category.category_id;

    row.append(
        td(category.category_id),
        td(category.active),
        td(category.name),
        actionsTd(category, row)
    );

    return row;
}

// Create action buttons for a category row
function actionsTd(category, row) {

    // Create a table cell for the action buttons
    const td = document.createElement("td");

    // Create Delete button
    const del = document.createElement("button");
    del.textContent = "Delete";
    del.onclick = () => deleteCategory(category.category_id, row);

    // Create Edit button
    const edit = document.createElement("button");
    edit.textContent = "Edit";
    edit.onclick = () => editCategory(category, row);

    // Append buttons to the cell
    td.append(del, edit);
    return td;
}

// Delete a category by ID
async function deleteCategory(id, row) {

    // Confirm deletion
    if (!confirm("Kategorie wirklich löschen?")) return;

    // Optimistically remove row from UI
    row.remove();

    // Send DELETE request to API
    try {
        // Send DELETE request to API
        await authFetch(`http://localhost/api/public/categories/${id}`, {
            method: "DELETE"
        });

        // Show success message
        showToast("Kategorie gelöscht", "success");
    } catch {

        // Show error message on failure
        showToast("Löschen fehlgeschlagen", "error");
    }
}

// Bind the Add Category button
function bindAddCategory() {
    // Get the Add Category button
    const btn = document.querySelector(".add-category-btn");
    if (!btn) return;

    // Set up click handler for adding a new category
    btn.onclick = async () => {
        const category = {

            // Gather input values for new category
            active: value("new-active"),
            name: value("new-name")
        };

        // Validate new category data
        const errors = validateCategory(category);

        // If validation errors exist, show them and abort
        if (errors.length) {
            errors.forEach(err => showToast(err, "error"));
            return;
        }

        // Optimistically add new row to UI
        const tempRow = createCategoryRow({

            // Create a temporary row with placeholder ID
            category_id: "…",
            active: category.active,
            name: category.name
        });

        // Prepend temporary row to table body
        document.querySelector("#categories-table-body").prepend(tempRow);

        try {
            // Send POST request to create new category
            const res = await authFetch("http://localhost/api/public/categories", {
                method: "POST",
                body: JSON.stringify(category)
            });

            // Update temporary row with real category ID
            tempRow.children[0].textContent = res.insertId;

            // Show success message
            showToast("Kategorie erstellt", "success");

        } catch {
            // On failure, remove temporary row and show error
            tempRow.remove();
            showToast("Kategorie konnte nicht erstellt werden", "error");
        }
    };
}

// Edit an existing category
function editCategory(category, row) {

    // Open modal dialog for editing category
    openModal(
        "Kategorie bearbeiten",
        `
            <label>Active (0/1)</label>
            <input id="edit-active" value="${category.active}">
            <label>Name</label>
            <input id="edit-name" value="${category.name}">
        `,

        // Save handler for modal
        async () => {
            // Gather updated values from modal inputs
            const updated = {
                active: document.getElementById("edit-active").value.trim(),
                name: document.getElementById("edit-name").value.trim()
            };

            // Validate updated category data
            const errors = validateCategory(updated);
            // If validation errors exist, show them and abort
            if (errors.length) {
                errors.forEach(err => showToast(err, "error"));
                return;
            }

            // Optimistically update row in UI
            row.children[1].textContent = updated.active;
            row.children[2].textContent = updated.name;

            // Send PATCH request to update category on server
            try {
                // Send PATCH request to update category
                await authFetch(`http://localhost/api/public/categories/${category.category_id}`, {
                    method: "PATCH",
                    body: JSON.stringify(updated)
                });

                // Show success message
                showToast("Kategorie aktualisiert", "success");

            } catch {
                // On failure, revert UI changes and show error
                showToast("Update fehlgeschlagen", "error");
            }
        }
    );
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
