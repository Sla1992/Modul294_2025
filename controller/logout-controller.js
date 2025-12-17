document.addEventListener("DOMContentLoaded", () => {
    sessionStorage.removeItem("jwt");
    localStorage.removeItem("jwt");
    setTimeout(() => {window.location.href = "/?page=login";}, 300);
});
