document.addEventListener("DOMContentLoaded", async () => {
    const token = sessionStorage.getItem("jwt");

    if (!token) {
        window.location.href = "?page=login";
        return;
    }

    try {
        const response = await fetch("http://localhost/api/public/products", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            console.error("API Fehler:", response.status);

            if (response.status === 401) {
                alert("Session abgelaufen. Bitte neu einloggen.");
                sessionStorage.removeItem("jwt");
                window.location.href = "?page=login";
            }
            return;
        }

        const products = await response.json();
        console.log("Produkte:", products);

        renderProducts(products);

    } catch (error) {
        console.error("Netzwerkfehler:", error);
        alert("API ist nicht erreichbar.");
    }
});


function renderProducts(products) {
    const tableBody = document.querySelector("#products-table-body");

    if (!tableBody) {
        console.error("Element #products-table-body nicht gefunden");
        return;
    }

    tableBody.innerHTML = "";

    products.forEach(product => {
        const row = document.createElement("tr");

        const idTd = document.createElement("td");
        idTd.textContent = product.product_id;

        const skuTd = document.createElement("td");
        skuTd.textContent = product.sku ?? "";

        const nameTd = document.createElement("td");
        nameTd.textContent = product.name ?? "";

        const categoryIdTd = document.createElement("td");
        categoryIdTd.textContent = product.id_category ?? "";

        const activeTd = document.createElement("td");
        activeTd.textContent = product.active ?? "";

        const priceTd = document.createElement("td");
        const priceNum = Number(product.price);
        priceTd.textContent = Number.isFinite(priceNum) ? `CHF ${priceNum.toFixed(2)}` : "";

        const stockTd = document.createElement("td");
        stockTd.textContent = product.stock ?? "";

        const actionsTd = document.createElement("td");

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.dataset.id = product.product_id;

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.classList.add("edit-btn");
        editBtn.dataset.id = product.product_id;

        actionsTd.append(deleteBtn, editBtn);

        row.append(
            idTd,
            skuTd,
            nameTd,
            categoryIdTd,
            activeTd,
            priceTd,
            stockTd,
            actionsTd
        );

        tableBody.appendChild(row);
    });
}


