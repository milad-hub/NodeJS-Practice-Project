function extractFormData(formData, allowedFields) {
    const userData = {};
    formData.forEach((value, key) => {
        if (allowedFields.includes(key)) {
            userData[key] = value;
        }
    });
    return userData;
}

function validatePassword(password, passwordConfirm) {
    return password === passwordConfirm;
}

function isRequiredFieldsFilled(form) {
    const inputs = form.querySelectorAll('input[required]');
    for (const input of inputs) {
        if (!input.value.trim()) {
            return false;
        }
    }
    return true;
}


export {
    extractFormData,
    validatePassword,
    isRequiredFieldsFilled
};