// this module provides a wrapper around fetch to include JWT authentication
async function authFetch(url, options = {}) {

    // Retrieve JWT token from sessionStorage
    const token = sessionStorage.getItem("jwt");

    // If no token, redirect to login
    if (!token) {
        redirectToLogin();
        throw new Error("Kein Auth-Token vorhanden");
    }

    // Set up default headers including Authorization
    const defaultOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    };

    // Merge default options with provided options
    const finalOptions = {

        // Spread the default and provided options
        ...defaultOptions,
        ...options,
        headers: {

            // Merge headers specifically
            ...defaultOptions.headers,
            ...(options.headers || {})
        }
    };

    // Make the fetch request
    let response;

    // Handle network errors
    try {

        // Perform the fetch request
        response = await fetch(url, finalOptions);
    } catch (error) {

        // If network error occurs, log and throw error
        console.error("Netzwerkfehler:", error);
        throw new Error("API nicht erreichbar");
    }

    // Handle unauthorized responses
    if (response.status === 401) {
        handleUnauthorized();
        throw new Error("Unauthorized");
    }

    // Handle other non-OK responses
    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "API Fehler");
    }

    // Parse and return JSON response
    return response.json();
}

// Handle unauthorized access by clearing token and redirecting
function handleUnauthorized() {
    sessionStorage.removeItem("jwt");
    alert("Session abgelaufen. Bitte neu einloggen.");
    redirectToLogin();
}

// Redirect user to login page
function redirectToLogin() {
    window.location.href = "/?page=login";
}
