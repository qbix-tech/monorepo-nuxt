import type { H3Event } from "h3";

export default defineI18nLocaleDetector((event, config) => {
  const query = getQuery(event);
  if (query && query.ui_locales) {
    return setAndReturnLocale(
      event,
      (query.ui_locales as string).split(" ")[0]?.toString() as string,
    );
  }

  // try to get locale from cookie
  const cookie = tryCookieLocale(event, { lang: "", name: "locale" }); // disable locale default value with `lang` option
  if (cookie) {
    return setAndReturnLocale(event, cookie.toString());
  }

  // try to get locale from header (`Accept-Language"`)
  const header = tryHeaderLocale(event); // disable locale default value with `lang` option
  if (header) {
    return setAndReturnLocale(event, header.toString());
  }

  // If the locale cannot be resolved up to this point, it is resolved with the value `defaultLocale` of the locale config passed to the function
  return setAndReturnLocale(event, config.defaultLocale);
});

const setAndReturnLocale = (event: H3Event, locale: string) => {
  setCookie(event, "locale", locale, {
    maxAge: 60 * 60 * 24 * 400, // 400 days
    sameSite: "lax",
  });
  return locale;
};
