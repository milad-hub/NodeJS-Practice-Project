const resetPasswordEmailOptions = (firstName, resetUrl) => {
    const subject = "Password Reset Request";
    const body = `Dear ${firstName},

We received a request to reset your password, please click on the following link:

${resetUrl}

Please note that this link is valid for the next 10 minutes. If you did not request a password reset, you can safely ignore this email.

Thank you`;

    return { subject, body };
};

module.exports = {
    resetPasswordEmailOptions
};
