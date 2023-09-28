import AuthServices from '../../../public/js/services/auth.js';
import displayToast from '../../../public/js/shared/toast.js';
import { extractFormData, validatePassword } from '../../../public/js/shared/common.js';

const _authServices = new AuthServices();

function toggleFormDisplay(formToShow) {
    const loginForm = document.querySelector('.login__register-login-form');
    const registerForm = document.querySelector('.login__register-register-form');
    const activeButton = document.querySelector('.login__register-btn.active');

    const forms = {
        'login': { show: loginForm, hide: registerForm, btnIndex: 1 },
        'register': { show: registerForm, hide: loginForm, btnIndex: 2 }
    };

    activeButton.classList.remove('active');
    forms[formToShow].show.style.display = "block";
    forms[formToShow].hide.style.display = "none";
    document.querySelector(`.login__register-btn:nth-child(${forms[formToShow].btnIndex})`).classList.add('active');
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
    const registerButton = document.getElementById('registerButton');
    registerButton.addEventListener('click', async function (event) {
        registerButton.disabled = true;
        event.preventDefault();

        const form = document.getElementById('registerForm');
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
                displayToast('Registered Successfully', 'success');
                toggleFormDisplay('login');
                form.reset();
            }

        } catch (error) {
            throw error;
        } finally {
            // to prevent users from mass clicking, I will implement a better solution later!
            // Lodash as global api service
            setTimeout(() => {
                registerButton.disabled = false;
            }, 1000);
        }
    });
});

window.toggleFormDisplay = toggleFormDisplay;
window.formatDate = formatDate;