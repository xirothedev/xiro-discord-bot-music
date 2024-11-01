import config from "@/config";
import { Language } from "@/typings/utils";
import { Locale } from "discord.js";
import i18n from "i18n";

export function initI18n(client: ExtendedClient) {
    i18n.configure({
        locales: Object.keys(Language),
        defaultLocale: typeof config.defaultLanguage === "string" ? config.defaultLanguage : "EnglishUS",
        directory: `${process.cwd()}/locales`,
        retryInDefaultLocale: true,
        objectNotation: true,
        register: global,
        logWarnFn: console.warn,
        logErrorFn: console.error,
        missingKeyFn: (_locale, value) => {
            return value;
        },
        mustacheConfig: {
            tags: ["{", "}"],
            disable: false,
        },
    });

    client.logger.info("I18n has been initialized");
}

export function T(locale: string, text: string | i18n.TranslateOptions, ...params: any) {
    i18n.setLocale(locale);
    return i18n.__mf(text, ...params);
}

export function localization(lan: keyof typeof Locale, name: string, desc: string) {
    return {
        name: [Locale[lan], name],
        description: [Locale[lan], T(lan, desc)],
    };
}

export function descriptionLocalization(name: string, text: string) {
	return i18n.getLocales().map((locale: string) => {
		// Check if the locale is a valid key of the Locale enum
		if (locale in Locale) {
			const localeValue = Locale[locale as keyof typeof Locale];
			return localization(localeValue as any, name, text);
		}
		// If locale is not in the enum, handle it accordingly
		return localization(locale as any, name, text); // You can choose how to handle this case
	});
}
