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

export const useSharedCookieConsent = createSharedComposable(useCookieConsent);
