async function authFetch(url, options = {}) {
    const token = sessionStorage.getItem("jwt");

    if (!token) {
        redirectToLogin();
        throw new Error("Kein Auth-Token vorhanden");
    }

    const defaultOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    };

    const finalOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...(options.headers || {})
        }
    };

    let response;

    try {
        response = await fetch(url, finalOptions);
    } catch (error) {
        console.error("Netzwerkfehler:", error);
        throw new Error("API nicht erreichbar");
    }

    if (response.status === 401) {
        handleUnauthorized();
        throw new Error("Unauthorized");
    }

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "API Fehler");
    }

    return response.json();
}

function handleUnauthorized() {
    sessionStorage.removeItem("jwt");
    alert("Session abgelaufen. Bitte neu einloggen.");
    redirectToLogin();
}

function redirectToLogin() {
    window.location.href = "/?page=login";
}
