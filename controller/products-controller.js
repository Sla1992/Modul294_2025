let validCategoryIds = [];

document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Kategorien laden (für Validation)
        const categories = await authFetch("http://localhost/api/public/categories");
        validCategoryIds = categories.map(c => Number(c.category_id));

        // Produkte laden
        const products = await authFetch("http://localhost/api/public/products");

        // 🔗 URL-Filter lesen
        const filters = getFiltersFromUrl();

        const filteredProducts = applyFilters(products, filters);

        renderProducts(filteredProducts);
        bindAddProduct();

    } catch (error) {
        console.error(error.message);
        showToast("Produkte konnten nicht geladen werden", "error");
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

function applyFilters(products, filters) {
    if (Object.keys(filters).length === 0) return products;

    return products.filter(product => {
        return Object.entries(filters).every(([key, value]) => {
            if (!(key in product)) return false;

            // Zahlen vergleichen
            if (!isNaN(product[key]) && !isNaN(value)) {
                return Number(product[key]) === Number(value);
            }

            // Strings vergleichen (case-insensitive)
            return String(product[key]).toLowerCase() === String(value).toLowerCase();
        });
    });
}

/* =====================================================
   RENDER
===================================================== */

function renderProducts(products) {
    const tableBody = document.querySelector("#products-table-body");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (products.length === 0) {
        showToast("Keine Produkte gefunden", "info");
        return;
    }

    products.forEach(product => {
        tableBody.appendChild(createProductRow(product));
    });
}

function createProductRow(product) {
    const row = document.createElement("tr");
    row.dataset.id = product.product_id;

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

/* =====================================================
   ACTIONS
===================================================== */

function actionsTd(product, row) {
    const td = document.createElement("td");

    const del = document.createElement("button");
    del.textContent = "Delete";
    del.onclick = () => deleteProduct(product.product_id, row);

    const edit = document.createElement("button");
    edit.textContent = "Edit";
    edit.onclick = () => editProduct(product, row);

    td.append(del, edit);
    return td;
}

/* =====================================================
   DELETE
===================================================== */

async function deleteProduct(id, row) {
    if (!confirm("Produkt wirklich löschen?")) return;

    row.remove(); // Optimistic UI

    try {
        await authFetch(`http://localhost/api/public/products/${id}`, {
            method: "DELETE"
        });
        showToast("Produkt gelöscht", "success");
    } catch {
        showToast("Löschen fehlgeschlagen", "error");
    }
}

/* =====================================================
   ADD / EDIT (unverändert)
===================================================== */

function bindAddProduct() {
    const btn = document.querySelector(".add-product-btn");
    if (!btn) return;

    btn.onclick = async () => {
        const product = {
            sku: value("new-sku"),
            name: value("new-name"),
            id_category: value("new-category-id"),
            active: value("new-active"),
            price: value("new-price"),
            stock: value("new-stock")
        };

        const errors = validateProduct(product, validCategoryIds);
        if (errors.length) {
            errors.forEach(err => showToast(err, "error"));
            return;
        }

        const tempRow = createProductRow({ ...product, product_id: "…" });
        document.querySelector("#products-table-body").prepend(tempRow);

        try {
            const res = await authFetch("http://localhost/api/public/products", {
                method: "POST",
                body: JSON.stringify(product)
            });

            tempRow.children[0].textContent = res.insertId;
            showToast("Produkt erstellt", "success");

        } catch {
            tempRow.remove();
            showToast("Produkt konnte nicht erstellt werden", "error");
        }
    };
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
