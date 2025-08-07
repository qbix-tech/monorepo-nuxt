/**
 * A composable to show a cookie consent toast when the user has not yet accepted cookies.
 *
 * @param key The key to use for the cookie. Defaults to "cookie-consent".
 * @param acceptValue The value to set when the user accepts cookies. Defaults to "accepted".
 */
export const useCookieConsent = (
  key: string = "cookie-consent",
  acceptValue: string = "accepted",
) => {
  const { t } = useI18n();
  const toast = useToast();

  const cookie = useCookie(key);

  onMounted(async () => {
    if (cookie.value === acceptValue) {
      return;
    }

    toast.add({
      title: t("ui.cookieConsent.title"),
      description: t("ui.cookieConsent.description"),
      duration: 0,
      close: false,
      actions: [
        {
          label: t("ui.cookieConsent.accept"),
          color: "neutral",
          variant: "outline",
          onClick: () => {
            cookie.value = acceptValue;
            refreshCookie(key);
          },
        },
        {
          label: t("ui.cookieConsent.optOut"),
          color: "neutral",
          variant: "ghost",
        },
      ],
    });
  });

  return {
    accepted: computed(() => cookie.value === acceptValue),
  };
};

/**
 * A shared composable for cookie consent that can be used across multiple components.
 * This ensures the same state is shared across components that use this composable.
 */
export const useSharedCookieConsent = createSharedComposable(useCookieConsent);
