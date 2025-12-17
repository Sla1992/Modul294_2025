document.addEventListener("DOMContentLoaded", () => {
    const token = sessionStorage.getItem("jwt");

    if (!token) {
        window.location.href = "/?page=login";
        return;
    }

    if (!isJwtFormat(token)) {
        sessionStorage.removeItem("jwt");
        window.location.href = "/?page=login";
        return;
    }

    const exp = getJwtExp(token);
    if (exp && Date.now() >= exp * 1000) {
        sessionStorage.removeItem("jwt");
        alert("Session abgelaufen. Bitte neu einloggen.");
        window.location.href = "/?page=login";
        return;
    }
});

function isJwtFormat(token) {
    const parts = token.split(".");
    return parts.length === 3 && parts.every(p => p.length > 0);
}

function getJwtExp(token) {
    try {
        const payloadBase64 = token.split(".")[1];
        const payloadJson = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
        const payload = JSON.parse(payloadJson);
        return payload.exp || null;
    } catch {
        return null;
    }
}
