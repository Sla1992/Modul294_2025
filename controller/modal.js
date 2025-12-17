function openModal(title, contentHtml, onSave) {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";

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

    document.body.appendChild(overlay);

    overlay.querySelector(".cancel-btn").onclick = () => overlay.remove();
    overlay.querySelector(".save-btn").onclick = () => {
        onSave();
        overlay.remove();
    };
}
