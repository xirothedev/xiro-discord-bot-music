import { Language } from "@/typings/utils";
import { Locale } from "discord.js";
import i18next from "i18next";
import Backend, { type FsBackendOptions } from "i18next-fs-backend";
import path from "path";

export async function initI18n(client: ExtendedClient) {
    try {
        await i18next.use(Backend).init<FsBackendOptions>({
            // Basic config
            fallbackLng: "EnglishUS",
            supportedLngs: [
                "EnglishUS",
                "Japanese",
                "Korean",
                "Indonesian",
                "Vietnamese",
            ],

            // Backend config
            backend: {
                loadPath: (lng: string) => {
                    return path.join(process.cwd(), "locales", `${lng}.json`);
                },
            },

            // Advanced config
            interpolation: {
                escapeValue: false,
                prefix: "{",
                suffix: "}",
            },

            // Missing key handling
            returnNull: false,
            returnEmptyString: false,
            returnObjects: true,
            fallbackNS: false,

            // Debug mode in development
            debug: false,

            // Namespace config
            ns: ["translation"],
            defaultNS: "translation",

            // Cache translations
            load: "all",
            preload: ["EnglishUS", "Japanese", "Korean", "Indonesian", "Vietnamese"],
        });

        client.logger.info("I18n has been initialized");
    } catch (error) {
        console.error("I18n initialization error:", error);
        throw error;
    }
}

// Helper function to get translation
export function T(locale: string, key: string, params?: any): string {
    // Convert locale to match filename
    const localeMap: { [key: string]: string } = {
        "en-US": "EnglishUS",
        en: "EnglishUS",
        ja: "Japanese",
        ko: "Korean",
        id: "Indonesian",
        vi: "Vietnamese",
    };

    try {
        // Map locale hoặc sử dụng fallback
        const mappedLocale = localeMap[locale] || locale || "EnglishUS";

        // Đổi ngôn ngữ
        i18next.changeLanguage(mappedLocale);

        // Lấy translation
        const translation = i18next.t(key, params);

        return translation.toString();
    } catch (error) {
        console.error("Translation error:", error);
        // Fallback về tiếng Anh nếu có lỗi
        i18next.changeLanguage("EnglishUS");
        return i18next.t(key, params).toString();
    }
}

// Helper function for localization
export function localization(lan: keyof typeof Locale, name: string, desc: string) {
    return {
        name: [Locale[lan], name],
        description: [Locale[lan], T(lan, desc)],
    };
}

export function descriptionLocalization(name: string, text: string) {
    return Object.keys(Language).map((locale: string) => {
        if (locale in Locale) {
            const localeValue = Locale[locale as keyof typeof Locale];
            return localization(locale as keyof typeof Locale, name, text);
        }
        return localization(locale as keyof typeof Locale, name, text);
    });
}

export { i18next };
