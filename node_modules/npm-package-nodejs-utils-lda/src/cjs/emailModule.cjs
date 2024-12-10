const nodemailer = require("nodemailer");
const { fopen, fwrite } = require("./autoFileSysModule.cjs");
const configs = fopen("config.json");
const configMail = {
    "service": configs.emailSystem?.service || "Gmail",
    "host": configs.emailSystem?.host || "smtp.gmail.com",
    "port": configs.emailSystem?.port || 25,
    "ssl_tls": configs.emailSystem?.ssl_tls || true,
    "user": configs.emailSystem?.user || "example@gmail.com",
}
let transporter;


if (nodemailer.createTransport({ service: configMail.service })) {
    // Se o serviço estiver entre os suportados pelo Nodemailer, use createTransport com o serviço
    transporter = nodemailer.createTransport({
        service: configMail.service || "Gmail",
        auth: {
            user: process.env.PINGOBRAS_SG_email_server,
            pass: process.env.PINGOBRAS_SG_email_password
        }
    });
} else {
    // Caso contrário, crie o transporte manualmente
    transporter = nodemailer.createTransport({
        host: configMail.host,
        port: configMail.port,
        secure: configMail.ssl_tls, // SSL/TLS ativado
        auth: {
            user: process.env.PINGOBRAS_SG_email_server,
            pass: process.env.PINGOBRAS_SG_email_password
        }
    });
}

function sendMail(email, subject, text, callback) {
    try {
        const mailOptions = {
            from: configMail.user, // Remetente
            to: email, // Destinatário
            subject: subject,
            text: text,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("SERVIDOR <sendMail>: Erro ao enviar o e-mail:", error);
                callback(error, null);
            } else {
                console.log("SERVIDOR <sendMail>: E-mail enviado:", info.response);
                callback(null, info);
            }
        });
    } catch (error) {
        console.error("SERVIDOR <sendMail>: Erro ao criar email: ", error);
        callback(error, null);
    }
}

module.exports = sendMail;