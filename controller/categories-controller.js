document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Kategorien laden
        const categories = await authFetch("http://localhost/api/public/categories");

        // 🔗 URL-Filter lesen (Permalinks)
        const filters = getFiltersFromUrl();

        const filteredCategories = applyFilters(categories, filters);

        renderCategories(filteredCategories);
        bindAddCategory();

    } catch (error) {
        console.error(error.message);
        showToast("Kategorien konnten nicht geladen werden", "error");
    }
});

/* =====================================================
   FILTERING (PERMALINKS)
===================================================== */

function getFiltersFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const filters = {};

    for (const [key, value] of params.entries()) {
        if (key === "page") continue;
        filters[key] = value;
    }

    return filters;
}

function applyFilters(categories, filters) {
    if (Object.keys(filters).length === 0) return categories;

    return categories.filter(category => {
        return Object.entries(filters).every(([key, value]) => {
            if (!(key in category)) return false;

            // Zahlen vergleichen
            if (!isNaN(category[key]) && !isNaN(value)) {
                return Number(category[key]) === Number(value);
            }

            // Strings vergleichen (case-insensitive)
            return String(category[key]).toLowerCase() === String(value).toLowerCase();
        });
    });
}

/* =====================================================
   RENDER
===================================================== */

function renderCategories(categories) {
    const tableBody = document.querySelector("#categories-table-body");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (categories.length === 0) {
        showToast("Keine Kategorien gefunden", "info");
        return;
    }

    categories.forEach(category => {
        tableBody.appendChild(createCategoryRow(category));
    });
}

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

/* =====================================================
   ACTIONS
===================================================== */

function actionsTd(category, row) {
    const td = document.createElement("td");

    const del = document.createElement("button");
    del.textContent = "Delete";
    del.onclick = () => deleteCategory(category.category_id, row);

    const edit = document.createElement("button");
    edit.textContent = "Edit";
    edit.onclick = () => editCategory(category, row);

    td.append(del, edit);
    return td;
}

/* =====================================================
   DELETE (OPTIMISTIC UI)
===================================================== */

async function deleteCategory(id, row) {
    if (!confirm("Kategorie wirklich löschen?")) return;

    row.remove(); // Optimistic UI

    try {
        await authFetch(`http://localhost/api/public/categories/${id}`, {
            method: "DELETE"
        });
        showToast("Kategorie gelöscht", "success");
    } catch {
        showToast("Löschen fehlgeschlagen", "error");
    }
}

/* =====================================================
   ADD (VALIDATION + OPTIMISTIC UI)
===================================================== */

function bindAddCategory() {
    const btn = document.querySelector(".add-category-btn");
    if (!btn) return;

    btn.onclick = async () => {
        const category = {
            active: value("new-active"),
            name: value("new-name")
        };

        const errors = validateCategory(category);
        if (errors.length) {
            errors.forEach(err => showToast(err, "error"));
            return;
        }

        const tempRow = createCategoryRow({
            category_id: "…",
            active: category.active,
            name: category.name
        });

        document.querySelector("#categories-table-body").prepend(tempRow);

        try {
            const res = await authFetch("http://localhost/api/public/categories", {
                method: "POST",
                body: JSON.stringify(category)
            });

            tempRow.children[0].textContent = res.insertId;
            showToast("Kategorie erstellt", "success");

        } catch {
            tempRow.remove();
            showToast("Kategorie konnte nicht erstellt werden", "error");
        }
    };
}

/* =====================================================
   EDIT (VALIDATION + MODAL)
===================================================== */

function editCategory(category, row) {
    openModal(
        "Kategorie bearbeiten",
        `
            <label>Active (0/1)</label>
            <input id="edit-active" value="${category.active}">
            <label>Name</label>
            <input id="edit-name" value="${category.name}">
        `,
        async () => {
            const updated = {
                active: document.getElementById("edit-active").value.trim(),
                name: document.getElementById("edit-name").value.trim()
            };

            const errors = validateCategory(updated);
            if (errors.length) {
                errors.forEach(err => showToast(err, "error"));
                return;
            }

            row.children[1].textContent = updated.active;
            row.children[2].textContent = updated.name;

            try {
                await authFetch(`http://localhost/api/public/categories/${category.category_id}`, {
                    method: "PATCH",
                    body: JSON.stringify(updated)
                });

                showToast("Kategorie aktualisiert", "success");

            } catch {
                showToast("Update fehlgeschlagen", "error");
            }
        }
    );
}

/* =====================================================
   HELPERS
===================================================== */

function td(text) {
    const td = document.createElement("td");
    td.textContent = text ?? "";
    return td;
}

function value(id) {
    return document.getElementById(id)?.value.trim();
}
