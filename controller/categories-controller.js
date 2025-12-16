document.addEventListener("DOMContentLoaded", async () => {
    const token = sessionStorage.getItem("jwt");

    if (!token) {
        window.location.href = "?page=login";
        return;
    }

    try {
     
        const response = await fetch("http://localhost/api/public/categories", {
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

        const categories = await response.json();
        console.log("Kategorien:", categories);

        renderCategories(categories);

    } catch (error) {
        console.error("Netzwerkfehler:", error);
        alert("API ist nicht erreichbar.");
    }
});

function renderCategories(categories) {
    const tableBody = document.querySelector("#categories-table-body");
    tableBody.innerHTML = ""; // Alte Inhalte löschen

    categories.forEach(category => {
        const row = document.createElement("tr");
 
        const idTd = document.createElement("td");
        idTd.textContent = category.category_id;
 
        const activeTd = document.createElement("td");
        activeTd.textContent = category.active;

        const nameTd = document.createElement("td");
        nameTd.textContent = category.name;

        const actionsTd = document.createElement("td");

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.dataset.id = category.category_id;

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.classList.add("edit-btn");
        editBtn.dataset.id = category.category_id;

        actionsTd.append(deleteBtn, editBtn);

        row.append(idTd, activeTd, nameTd, actionsTd);
        tableBody.appendChild(row);
    });
}
