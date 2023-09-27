const { UserApiController } = require('../../controllers/user.controller');

const userApiController = new UserApiController();

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

        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const dateOfBirth = document.getElementById('dateOfBirth').value;
        const email = document.getElementById('email').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordConfirm').value;

        if (password !== passwordConfirm) {
            alert('Passwords do not match. Please try again.');
            return;
        }

        const userData = {
            firstName: firstName,
            lastName: lastName,
            dateOfBirth: dateOfBirth,
            email: email,
            username: username,
            password: password,
            passwordConfirm: passwordConfirm
        };

        console.log(userData);
        await userApiController.createUser(userData);
        toggleFormDisplay('login');
    });
});