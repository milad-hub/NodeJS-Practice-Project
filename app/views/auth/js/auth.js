import AuthServices from '../../../public/js/services/auth.js';
import displayToast from '../../../public/js/shared/toast.js';
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

function formatDate(event) {
    event.preventDefault();
    const dateOfBirthInput = document.getElementById('dateOfBirth');
    const dateValue = dateOfBirthInput.value;
    const parts = dateValue.split('-');
    const formattedDate = `${parts[0]}-${parts[1]}-${parts[2]}`;
    dateOfBirthInput.value = formattedDate;
}

document.addEventListener('DOMContentLoaded', async function () {
    const loginButton = document.getElementById('loginButton');
    loginButton.addEventListener('click', async function (event) {
        loginButton.disabled = true;
        event.preventDefault();

        const form = document.getElementById('loginForm');

        if (!isRequiredFieldsFilled(form)) {
            loginButton.disabled = false;
            displayToast('Please enter username and password!', 'error');
            return;
        }

        const formData = new FormData(form);

        const allowedFields = ['username', 'password'];

        const userData = extractFormData(formData, allowedFields);

        try {
            const response = await _authServices.loginUser(userData);
            if (response) {
                displayToast(response.message, 'success');
                form.reset();
                window.location.href = './users';
            }
        } catch (error) {
            throw error;
        } finally {
            // to prevent users from mass clicking, I will implement a better solution later!
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

        const form = document.getElementById('registerForm');

        if (!isRequiredFieldsFilled(form)) {
            registerButton.disabled = false;
            displayToast('Please fill in all required fields', 'error');
            return;
        }

        const formData = new FormData(form);

        const allowedFields = ['firstName', 'lastName', 'dateOfBirth', 'email', 'username', 'password', 'passwordConfirm'];

        const userData = extractFormData(formData, allowedFields);

        if (!validatePassword(userData.password, userData.passwordConfirm)) {
            registerButton.disabled = false;
            displayToast('Passwords do not match. Please try again', 'error');
            return;
        }

        try {
            const response = await _authServices.registerUser(userData);
            if (response) {
                console.log(response);
                displayToast(response.message, 'success');
                toggleFormDisplay('login');
                form.reset();
            }
        } catch (error) {
            throw error;
        } finally {
            // to prevent users from mass clicking, I will implement a better solution later!
            setTimeout(() => {
                registerButton.disabled = false;
            }, 1000);
        }
    });
});


window.toggleFormDisplay = toggleFormDisplay;
window.formatDate = formatDate;