const nodemailer = require('nodemailer');
const SMTP_CONFIG = require('./config/smtp');

const transporter = nodemailer.createTransport({
    host: SMTP_CONFIG.host,
    port: SMTP_CONFIG.port,
    secure: false,
    auth: {
        user: SMTP_CONFIG.user,
        pass: SMTP_CONFIG.pass
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = async function sendMail(name, username, email) {
    const mailSent = await transporter.sendMail({
        text: `Olá ${name}, seu cadastro na GOODNEWS com username: ${username} foi realizado com sucesso!`,
        subject: "Bem Vindo à GoodNews!",
        from: "GoodNews <goodnews.redesocial@gmail.com>",
        to: [email]
    });
}