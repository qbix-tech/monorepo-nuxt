<script lang="ts">
export interface CookieConsentProps {
  /**
   * The key to use for the cookie.
   * @defaultValue 'cookie-consent'
   */
  cookieKey?: string;
  /**
   * The value to set when the cookie is accepted.
   * @defaultValue 'accepted'
   */
  cookieAcceptValue?: string;
}
</script>

<script setup lang="ts">
const props = defineProps<CookieConsentProps>();

const { accepted } = useCookieConsent(props.cookieKey, props.cookieAcceptValue);

defineExpose({
  accepted,
});
</script>
