// Simple modal implementation
function openModal(title, contentHtml, onSave) { 

    // Create modal elements
    const overlay = document.createElement("div");

    // Set class for styling
    overlay.className = "modal-overlay";

    // Set inner HTML
    overlay.innerHTML = `
        <div class="modal">
            <h3>${title}</h3>
            <div class="modal-body">${contentHtml}</div>
            <div class="modal-actions">
                <button class="cancel-btn">Cancel</button>
                <button class="save-btn">Save</button>
            </div>
        </div>
    `;

    // Append to body
    document.body.appendChild(overlay);

    // Set up button handlers
    overlay.querySelector(".cancel-btn").onclick = () => overlay.remove();
    overlay.querySelector(".save-btn").onclick = () => {
        onSave();
        overlay.remove();
    };
}
