import AuthServices from '../../../public/js/services/auth.js';
import displayToast from '../../../public/js/shared/toast.js';
import { statusCode } from '../../../public/js/shared/config.js';
import { extractFormData, validatePassword, isRequiredFieldsFilled } from '../../../public/js/shared/common.js';

const _authServices = new AuthServices();

function toggleFormDisplay(formToShow) {
    const loginForm = document.querySelector('.auth-login-form');
    const registerForm = document.querySelector('.auth-register-form');
    const activeButton = document.querySelector('.auth-btn.active');

    const forms = {
        'login': { show: loginForm, hide: registerForm, btnIndex: 1 },
        'register': { show: registerForm, hide: loginForm, btnIndex: 2 }
    };

    activeButton.classList.remove('active');
    forms[formToShow].show.style.display = "block";
    forms[formToShow].hide.style.display = "none";
    document.querySelector(`.auth-btn:nth-child(${forms[formToShow].btnIndex})`).classList.add('active');
}

function toggleForgotPasswordForm() {
    const formSelector = document.getElementById('formSelector');
    const loginFormContainer = document.getElementById('loginFormContainer');
    const forgotPasswordFormContainer = document.getElementById('forgotPasswordFormContainer');

    formSelector.style.display = 'none';
    loginFormContainer.style.display = 'none';
    forgotPasswordFormContainer.style.display = 'block';
}

function toggleBackToLogin() {
    const formSelector = document.getElementById('formSelector');
    const loginFormContainer = document.getElementById('loginFormContainer');
    const forgotPasswordFormContainer = document.getElementById('forgotPasswordFormContainer');

    formSelector.style.display = '';
    loginFormContainer.style.display = 'block';
    forgotPasswordFormContainer.style.display = 'none';
}

function toggleResetPasswordForm() {
    const formSelector = document.getElementById('formSelector');
    const loginFormContainer = document.getElementById('loginFormContainer');
    const resetPasswordFormContainer = document.getElementById('resetPasswordFormContainer');

    formSelector.style.display = 'none';
    loginFormContainer.style.display = 'none';
    resetPasswordFormContainer.style.display = 'block';
}

function formatDate(event) {
    event.preventDefault();
    const dateOfBirthInput = document.getElementById('dateOfBirth');
    const dateValue = dateOfBirthInput.value;
    const parts = dateValue.split('-');
    const formattedDate = `${parts[0]}-${parts[1]}-${parts[2]}`;
    dateOfBirthInput.value = formattedDate;
}

document.addEventListener('DOMContentLoaded', function () {
    const regex = /^\/auth\/.{32,}$/;
    const match = window.location.pathname.match(regex);

    if (match && window.location.pathname !== '/auth') {
        toggleResetPasswordForm();
    }

    if (!match && window.location.pathname !== '/auth') {
        window.location.href = '/auth';
    }
});

document.addEventListener('DOMContentLoaded', async function () {
    const loginButton = document.getElementById('loginButton');
    loginButton.addEventListener('click', async function (event) {
        loginButton.disabled = true;
        event.preventDefault();

        const loginForm = document.getElementById('loginForm');

        if (!isRequiredFieldsFilled(loginForm)) {
            loginButton.disabled = false;
            displayToast('Please enter username and password!', 'error');
            return;
        }

        const formData = new FormData(loginForm);

        const allowedFields = ['username', 'password'];

        const userData = extractFormData(formData, allowedFields);

        try {
            await _authServices.loginUser(userData);
        } catch (error) {
            throw error;
        } finally {
            setTimeout(() => {
                loginButton.disabled = false;
            }, 1000);
        }
    });
});

document.addEventListener('DOMContentLoaded', async function () {
    const registerButton = document.getElementById('registerButton');
    registerButton.addEventListener('click', async function (event) {
        registerButton.disabled = true;
        event.preventDefault();

        const registerForm = document.getElementById('registerForm');

        if (!isRequiredFieldsFilled(registerForm)) {
            registerButton.disabled = false;
            displayToast('Please fill in all required fields', 'error');
            return;
        }

        const formData = new FormData(registerForm);

        const allowedFields = ['firstName', 'lastName', 'dateOfBirth', 'email', 'username', 'password', 'passwordConfirm'];

        const userData = extractFormData(formData, allowedFields);

        if (!validatePassword(userData.password, userData.passwordConfirm)) {
            registerButton.disabled = false;
            displayToast('Passwords do not match. Please try again', 'error');
            return;
        }

        try {
            const response = await _authServices.registerUser(userData);
            if (response.status === statusCode.created) {
                toggleFormDisplay('login');
                registerForm.reset();
            }
        } catch (error) {
            throw error;
        } finally {
            setTimeout(() => {
                registerButton.disabled = false;
            }, 1000);
        }
    });
});

document.addEventListener('DOMContentLoaded', async function () {
    const forgotPasswordButton = document.getElementById('forgotPasswordButton');
    forgotPasswordButton.addEventListener('click', async function (event) {
        forgotPasswordButton.disabled = true;
        event.preventDefault();

        const forgotPasswordForm = document.getElementById('forgotPasswordForm');

        if (!isRequiredFieldsFilled(forgotPasswordForm)) {
            forgotPasswordButton.disabled = false;
            displayToast('Please enter your email', 'error');
            return;
        }

        const formData = new FormData(forgotPasswordForm);

        const allowedFields = ['email'];

        const userData = extractFormData(formData, allowedFields);

        try {
            forgotPasswordButton.disabled = true;
            forgotPasswordButton.textContent = 'Please Wait...';
            const response = await _authServices.forgotPassword(userData);
            if (response.status === statusCode.ok) {
                toggleBackToLogin();
                forgotPasswordForm.reset();
            }

        } catch (error) {
            throw error;
        } finally {
            forgotPasswordButton.textContent = 'Reset Password';
            setTimeout(() => {
                forgotPasswordButton.disabled = false;
            }, 1000);
        }
    });
});

document.addEventListener('DOMContentLoaded', async function () {
    const resetPasswordButton = document.getElementById('resetPasswordButton');
    resetPasswordButton.addEventListener('click', async function (event) {
        resetPasswordButton.disabled = true;
        event.preventDefault();

        const resetPasswordForm = document.getElementById('resetPasswordForm');

        if (!isRequiredFieldsFilled(resetPasswordForm)) {
            resetPasswordButton.disabled = false;
            displayToast('Please fill in all required fields', 'error');
            return;
        }

        const formData = new FormData(resetPasswordForm);

        const allowedFields = ['password', 'passwordConfirm'];

        const userData = extractFormData(formData, allowedFields);

        const token = window.location.pathname.split('/auth/')[1];

        userData.token = token;

        if (!validatePassword(userData.password, userData.passwordConfirm)) {
            resetPasswordButton.disabled = false;
            displayToast('Passwords do not match. Please try again', 'error');
            return;
        }

        try {
            const response = await _authServices.resetPassword(userData);
            if (response.status === statusCode.ok) {
                setTimeout(() => {
                    window.location.href = '/auth';
                    resetPasswordForm.reset();
                }, 1000);
            }
        } catch (error) {
            throw error;
        } finally {
            setTimeout(() => {
                resetPasswordButton.disabled = false;
            }, 1000);
        }
    });
});


window.toggleFormDisplay = toggleFormDisplay;
window.formatDate = formatDate;
window.toggleForgotPasswordForm = toggleForgotPasswordForm;
window.toggleBackToLogin = toggleBackToLogin;
window.toggleResetPasswordForm = toggleResetPasswordForm;