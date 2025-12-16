document.addEventListener("DOMContentLoaded", () => {
    sessionStorage.removeItem("jwt");
    setTimeout(() => {
        window.location.href = "/?page=login";
    }, 500);
    alert("Du wurdest erfolgreich abgemeldet.");
});
