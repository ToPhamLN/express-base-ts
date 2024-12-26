import path from "path";
import { TransportOptions } from "nodemailer";

export const MAIL_VERIFY_OTP = (email: string, otp: string) =>
    ({
        from: "donhibatai@gmail.com",
        to: email,
        subject: "One-time Verification Code",
        html: `
        <div style="font-family:Arial,sans-serif;margin:0;padding:0;background-color:#f6f6f6;">
            <div style="max-width:600px;margin:0 auto;background:white;border:1px solid #e8e8e8;padding:20px;">
                <div style="text-align:center;">
                    <img src="cid:logo" alt="Logo" style="width:150px;"/>
                </div>
                <h2 style="color:#333;">Action Required: One-Time Verification Code</h2>
                <p style="font-size:16px;color:#555;">You are receiving this email because a request was made for a one-time code for authentication on your account.</p>
                <p style="font-size:16px;color:#555;">Please enter the following code to complete the verification process:</p>
                <h1 style="text-align:center;color:#333;font-size:30px;line-height:1.2;">${otp}</h1>
                <p style="font-size:16px;color:#555;">If you did not request this code, please change your password immediately or use the chat feature in the MMO Web3 user interface to contact us.</p>
                <p style="font-size:16px;color:#555;">Thank you for using our services!</p>
            </div>
        </div>
    `,
        attachments: [
            {
                filename: "Logo.png",
                path: path.join(__dirname, "../assets/Logo.png"),
                cid: "logo",
            },
        ],
    }) as TransportOptions;
