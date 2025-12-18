// Validation for category and product forms
function validateCategory(category) {
    const errors = [];
    
    // Active must be 0 or 1
    if (!/^[01]$/.test(category.active)) {
        errors.push("Active muss 0 oder 1 sein");
    }

    // Name: alphanumeric, max 20 chars
    if (!/^[a-zA-Z0-9]{1,20}$/.test(category.name)) {
        errors.push("Name darf nur Buchstaben und Zahlen enthalten (max. 20)");
    }

    // return collected errors
    return errors;
}

// Validation for product forms
function validateProduct(product, validCategoryIds) {
    const errors = [];

    // SKU: alphanumeric, max 10 chars
    if (!/^[a-zA-Z0-9]{1,10}$/.test(product.sku)) {
        errors.push("SKU max. 10 Zeichen, nur Buchstaben/Zahlen");
    }

    // Name: alphanumeric, max 20 chars
    if (!/^[a-zA-Z0-9]{1,20}$/.test(product.name)) {
        errors.push("Name max. 20 Zeichen, nur Buchstaben/Zahlen");
    }

    // Active must be 0 or 1
    if (!/^[01]$/.test(product.active)) {
        errors.push("Active muss 0 oder 1 sein");
    }

    // Category ID must be in validCategoryIds
    if (!/^\d+$/.test(product.id_category) ||
        !validCategoryIds.includes(Number(product.id_category))) {
        errors.push("Ungültige Kategorie");
    }

    // Price must be a number >= 0
    if (isNaN(product.price) || Number(product.price) < 0) {
        errors.push("Preis muss >= 0 sein");
    }

    // Stock must be an integer >= 0
    if (!/^\d+$/.test(product.stock)) {
        errors.push("Stock muss eine Ganzzahl >= 0 sein");
    }

    // return collected errors
    return errors;
}

// Expose validation functions globally
window.validateCategory = validateCategory;
window.validateProduct = validateProduct;
