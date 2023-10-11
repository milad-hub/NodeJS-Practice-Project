const nodemailer = require("nodemailer");

const sendMail = async (targetEmail, subject, body) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 587,
            auth: {
                user: "ab55b5c8d429ea",
                pass: "0765360c3f2334"
            }
        });

        const mailOptions = {
            from: "milad445@gmail.com",
            to: targetEmail,
            subject: subject,
            text: body,
        };

        await transporter.sendMail(mailOptions);

        console.log("Email has been sent successfully to " + targetEmail);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = sendMail;
