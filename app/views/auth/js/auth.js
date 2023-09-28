import UserServices from '../../../public/js/services/user.js';
import { extractFormData, validatePassword } from '../../../public/js/shared/common.js';
import { toastMessage } from '../../../public/js/shared/toast.js';

const _userServices = new UserServices();

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
        event.preventDefault();

        const form = document.getElementById('registerForm');
        const formData = new FormData(form);

        const allowedFields = ['firstName', 'lastName', 'dateOfBirth', 'email', 'username', 'password', 'passwordConfirm'];

        const userData = extractFormData(formData, allowedFields);

        if (!validatePassword(userData.password, userData.passwordConfirm)) {
            alert('Passwords do not match. Please try again.');
            return;
        }
        const response = await _userServices.createUser(userData);
        if (response) {
            toastMessage('Registered Successfully', 'success');
            toggleFormDisplay('login');
            form.reset();
        }
    });
});

window.toggleFormDisplay = toggleFormDisplay;
window.formatDate = formatDate;