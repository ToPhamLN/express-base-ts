import dotenv from "dotenv";
dotenv.config({ path: ".env.dev" });

export const configs = {
    port: process.env.PORT ?? 5000,
    mongodb: process.env.MONGODB ?? "",
    baseUrl: process.env.BASE_URL ?? "/api/v1",
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET ?? "",
        refreshSecret: process.env.JWT_REFRESH_SECRET ?? "",
        accessExpire: process.env.JWT_ACCESS_EXPIRE ?? "",
        refreshExpire: process.env.JWT_REFRESH_EXPIRE ?? "",
    },
    serverKey: process.env.SERVER_KEY ?? "",
    clientKey: process.env.CLIENT_KEY ?? "",
    turnstile: {
        secretKey: process.env.TURNSTILE_SECRET_KEY ?? "",
        siteKey: process.env.TURNSTILE_SITE_KEY ?? "",
    },
    nodeEnv: process.env.NODE_ENV ?? "development",
    banking: {
        password: process.env.BANKING_PASSWORD ?? "",
        number: process.env.BANKING_NUMBER ?? "",
        token: process.env.BANKING_TOKEN ?? "",
    },
    firebase: {
        apiKey: process.env.FIREBASE_API_KEY ?? "",
        authDomain: process.env.FIREBASE_AUTH_DOMAIN ?? "",
        projectId: process.env.FIREBASE_PROJECT_ID ?? "",
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET ?? "",
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID ?? "",
        appId: process.env.FIREBASE_APP_ID ?? "",
        measurementId: process.env.FIREBASE_MEASUREMENT_ID ?? "",
    },
    smtp: {
        service: process.env.SMTP_SERVICE ?? "",
        host: process.env.SMTP_HOST ?? "",
        port: process.env.SMTP_PORT ?? "",
        secure: process.env.SMTP_SECURE ?? "",
        user: process.env.SMTP_USER ?? "",
        password: process.env.SMTP_PASSWORD ?? "",
        mailAdmin: process.env.MAIL_ADMIN ?? "",
    },
    redis: {
        host: process.env.REDIS_HOST ?? "",
        port: process.env.REDIS_PORT ?? "",
        password: process.env.REDIS_PASSWORD ?? "",
        db: process.env.REDIS_DB ?? "",
    },
};
