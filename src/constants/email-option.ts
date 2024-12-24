import { TransportOptions } from "nodemailer";
import path from "path";

export const MAIL_VERIFY_OTP = (email: string, otp: string) =>
    ({
        from: "admin@mmoweb3.com",
        to: email,
        subject: "One-time verification code",
        html: `
            <div style="font-family:Arial,sans-serif;margin:0;padding:0;background-color:#f6f6f6;">
                <div style="max-width:600px;margin:0 auto;background:white;border:1px solid #e8e8e8;padding:20px;">
                    <div style="text-align:center;">
                        <img src="cid:logo" alt="Logo" style="width:150px;"/>
                    </div>
                    <h2 style="color:#333;">Action Required: One-Time Verification Code</h2>
                    <p>You are receiving this email because a request was made for a one-time code for authentication.</p>
                    <p>Please enter the following code to complete verification:</p>
                    <h1 style="text-align:center;color:#333;">${otp}</h1>
                    <p>If you did not request this change, please change your password or use the chat feature in the MMO Web3 user interface to contact us.</p>
                </div>
            </div>
        `,
        attachments: [
            {
                filename: "Logo.png",
                path: path.join(__dirname, "../"),
                cid: "logo",
            },
        ],
    }) as TransportOptions;
