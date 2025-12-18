// Toast notification utility
function showToast(message, type = "info") {

    // Create toast element
    const toast = document.createElement("div");

    // Set class and content
    toast.className = `toast toast-${type}`;

    // Set message
    toast.textContent = message;

    // Append to body
    document.body.appendChild(toast);

    // Show and auto-remove toast
    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Expose showToast globally
window.showToast = showToast;