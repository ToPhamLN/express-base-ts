import nodemailer, { TransportOptions } from "nodemailer";
import { configs } from "./configuration";

const transport = nodemailer.createTransport({
    service: configs.smtp.service,
    host: configs.smtp.host,
    port: Number(configs.smtp.port),
    secure: configs.smtp.secure === "true",
    auth: {
        user: configs.smtp.user,
        pass: configs.smtp.password,
    },
});

export const sendEmail = async (options: TransportOptions) => {
    const mailOptions = {
        ...options,
        from: `"My WWW.COM" <${configs.smtp.mailAdmin}>`,
    };
    await transport.sendMail(mailOptions);
};
