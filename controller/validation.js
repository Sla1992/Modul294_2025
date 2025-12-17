function validateCategory(category) {
    const errors = [];

    // active: Pflicht, nur 0 oder 1
    if (!/^[01]$/.test(category.active)) {
        errors.push("Active muss 0 oder 1 sein");
    }

    // name: Pflicht, nur Buchstaben & Zahlen, max. 20 Zeichen
    if (!/^[a-zA-Z0-9]{1,20}$/.test(category.name)) {
        errors.push("Name darf nur Buchstaben und Zahlen enthalten (max. 20)");
    }

    return errors;
}

function validateProduct(product, validCategoryIds) {
    const errors = [];

    if (!/^[a-zA-Z0-9]{1,10}$/.test(product.sku)) {
        errors.push("SKU max. 10 Zeichen, nur Buchstaben/Zahlen");
    }

    if (!/^[a-zA-Z0-9]{1,20}$/.test(product.name)) {
        errors.push("Name max. 20 Zeichen, nur Buchstaben/Zahlen");
    }

    if (!/^[01]$/.test(product.active)) {
        errors.push("Active muss 0 oder 1 sein");
    }

    if (!/^\d+$/.test(product.id_category) ||
        !validCategoryIds.includes(Number(product.id_category))) {
        errors.push("Ungültige Kategorie");
    }

    if (isNaN(product.price) || Number(product.price) < 0) {
        errors.push("Preis muss >= 0 sein");
    }

    if (!/^\d+$/.test(product.stock)) {
        errors.push("Stock muss eine Ganzzahl >= 0 sein");
    }

    return errors;
}

// GLOBAL verfügbar machen
window.validateCategory = validateCategory;
window.validateProduct = validateProduct;
