const nodemailer = require("nodemailer");
const configs = JSON.parse(fs.readFileSync("config.json", "utf8"));
const configMail = configs.emailSystem
const transporter = nodemailer.createTransport({
    host: configMail.host,
    port: configMail.port,
    secure: configMail.ssl_tls, // SSL/TLS ativado
    auth: {
        user: configMail.user,
        pass: configMail.pass
    }
});

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