import AuthServices from '/public/js/services/auth.js';
import displayToast from '/public/js/shared/toast.js';

const _authServices = new AuthServices();

document.addEventListener('DOMContentLoaded', async function () {
    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', async function (event) {

        logoutButton.disabled = true;
        event.preventDefault();

        try {
            return await _authServices.logoutUser();
        } catch (error) {
            throw error;
        } finally {
            setTimeout(() => {
                logoutButton.disabled = false;
            }, 1000);
        }

    });
});