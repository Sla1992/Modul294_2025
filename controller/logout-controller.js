// Clear JWT tokens on logout and redirect to login page
document.addEventListener("DOMContentLoaded", () => {

    // Remove tokens from sessionStorage
    sessionStorage.removeItem("jwt");

    // Remove tokens from localStorage
    localStorage.removeItem("jwt");
    
    // Redirect to login page after short delay
    setTimeout(() => {window.location.href = "/?page=login";}, 300);
});
