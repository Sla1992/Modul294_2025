document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".login-form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = document.querySelector("#username").value.trim();
        const password = document.querySelector("#password").value.trim();

        const oldError = document.querySelector(".login-error");
        if (oldError) oldError.remove();

        try {
            const response = await fetch("http://localhost/api/public/auth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            const data = await response.json();
            console.log("API Response:", data);

            if (!response.ok) {
                showError(data.error || "Login fehlgeschlagen");
                return;
            }

            if (!data.token) {
                showError("Fehler: Kein Token erhalten");
                return;
            }

            sessionStorage.setItem("jwt", data.token);
            window.location.href = "?page=index";
            alert("Erfolgreich eingeloggt!");

        } catch (error) {
            console.error("Netzwerkfehler:", error);
            showError("Die API ist momentan nicht erreichbar.");
        }
    });
});

function showError(message) {
    const container = document.querySelector(".login-container");

    const p = document.createElement("p");
    p.classList.add("login-error");
    p.style.color = "red";
    p.style.textAlign = "center";
    p.style.marginTop = "10px";
    p.textContent = message;

    container.appendChild(p);
}
