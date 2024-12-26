import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";
import path from "path";

export async function initI18Config() {
    await i18next
        .use(Backend)
        .use(middleware.LanguageDetector)
        .init({
            fallbackLng: "en",
            preload: ["en", "vi"],
            ns: ["common", "user"],
            backend: {
                loadPath: path.join(
                    __dirname,
                    "../locales/{{lng}}/{{ns}}.json"
                ),
            },
            detection: {
                order: ["header"],
                caches: false,
            },
        });

    return i18next;
}
