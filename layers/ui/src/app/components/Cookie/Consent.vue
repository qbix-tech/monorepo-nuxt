<script setup lang="ts">
const props = defineProps<{
  cookieKey?: string;
  cookieAcceptValue?: string;
}>();

const { accepted } = useCookieConsent(props.cookieKey, props.cookieAcceptValue);

defineExpose({
  accepted,
});
</script>
