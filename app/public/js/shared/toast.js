function displayToast(message, type) {
    const messageContainer = document.getElementById('toastMessage');
    const newMessage = createMessageElement(message, type);
    messageContainer.appendChild(newMessage);
    showMessageContainer(messageContainer);
    removeMessageAfterDelay(newMessage, messageContainer);
}

function createMessageElement(message, type) {
    const newMessage = document.createElement('div');
    newMessage.classList.add('message', type);
    newMessage.innerText = message;
    return newMessage;
}

function showMessageContainer(messageContainer) {
    messageContainer.style.opacity = 1;
}

function removeMessageAfterDelay(newMessage, messageContainer) {
    setTimeout(() => {
        newMessage.style.transition = 'opacity 0.3s ease-in-out';
        newMessage.style.opacity = 0;
        setTimeout(() => {
            newMessage.remove();
            if (messageContainer.childElementCount === 0) {
                hideMessageContainer(messageContainer);
            }
        }, 300);
    }, 3000);
}

function hideMessageContainer(messageContainer) {
    messageContainer.style.opacity = 0;
}

export default displayToast;