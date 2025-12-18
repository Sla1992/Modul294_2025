// The guard that protects routes from unauthenticated access
document.addEventListener("DOMContentLoaded", () => {

    // Retrieve JWT token from sessionStorage
    const token = sessionStorage.getItem("jwt");

    // Redirect to login if no token found
    if (!token) {
        window.location.href = "/?page=login";
        return;
    }

    // Validate JWT format and expiration
    if (!isJwtFormat(token)) {
        sessionStorage.removeItem("jwt");
        window.location.href = "/?page=login";
        return;
    }

    // Check token expiration
    const exp = getJwtExp(token);

    // If expired, clear token and redirect to login
    if (exp && Date.now() >= exp * 1000) {
        sessionStorage.removeItem("jwt");
        alert("Session abgelaufen. Bitte neu einloggen.");
        window.location.href = "/?page=login";
        return;
    }
});

// Helper to validate JWT format
function isJwtFormat(token) {
    
    // A valid JWT has three parts separated by dots
    const parts = token.split(".");
    return parts.length === 3 && parts.every(p => p.length > 0);
}

// Helper to extract expiration time from JWT
function getJwtExp(token) {

    // Decode JWT payload and parse expiration
    try {
        const payloadBase64 = token.split(".")[1];
        const payloadJson = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
        const payload = JSON.parse(payloadJson);
        return payload.exp || null;
    } catch {
        return null;
    }
}
