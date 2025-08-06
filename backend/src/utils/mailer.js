const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // misalnya "smtp.gmail.com"
    port: process.env.SMTP_PORT || 587,
    secure: false, // true untuk port 465
    auth: {
        user: process.env.SMTP_USER, // email pengirim
        pass: process.env.SMTP_PASS  // password / app password
    }
});

async function sendEmail(to, subject, html) {
    await transporter.sendMail({
        from: `"Event App" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html
    });
}

module.exports = sendEmail;
