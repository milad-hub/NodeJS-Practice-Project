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

export {
    extractFormData,
    validatePassword
};