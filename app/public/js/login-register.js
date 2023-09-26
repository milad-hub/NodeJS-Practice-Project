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
    const dobInput = document.getElementById('dob');
    const dateValue = dobInput.value;
    const parts = dateValue.split('-');
    const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
    dobInput.value = formattedDate;
}