// Handle login form submission and JWT token storage
document.addEventListener("DOMContentLoaded", () => {

    // Get the login form element
    const form = document.querySelector(".login-form");

    // Listen for form submission
    form.addEventListener("submit", async (event) => {

        // Prevent default form submission behavior
        event.preventDefault();

        // Get username and password values
        const username = document.querySelector("#username").value.trim();
        const password = document.querySelector("#password").value.trim();

        // Remove any existing error messages
        const oldError = document.querySelector(".login-error");
        if (oldError) oldError.remove();

        // Send login request to API
        try {
            const response = await fetch("http://localhost/api/public/auth", {

                // Use POST method
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },

                // Send username and password in request body
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            // Parse JSON response
            const data = await response.json();
            console.log("API Response:", data);

            // Handle non-OK responses
            if (!response.ok) {
                showError(data.error || "Login fehlgeschlagen");
                return;
            }

            // Ensure token is present in response
            if (!data.token) {
                showError("Fehler: Kein Token erhalten");
                return;
            }

            // Store JWT token based on "remember me" checkbox
            sessionStorage.setItem("jwt", data.token);

            // Redirect to index page
            window.location.href = "?page=index";

            // Optionally, show success message
            alert("Erfolgreich eingeloggt!");

        // Handle network errors
        } catch (error) {
            console.error("Netzwerkfehler:", error);
            showError("Die API ist momentan nicht erreichbar.");
        }
    });
});

// Function to display error messages on the login form
function showError(message) {

    // Get the container for the login form
    const container = document.querySelector(".login-container");

    // Create error message element
    const p = document.createElement("p");
    p.classList.add("login-error");
    p.style.color = "red";
    p.style.textAlign = "center";
    p.style.marginTop = "10px";
    p.textContent = message;

    // Append error message to container
    container.appendChild(p);
}
