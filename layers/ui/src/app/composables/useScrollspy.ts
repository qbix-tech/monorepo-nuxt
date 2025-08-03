/**
 * A composable that tracks headings in view as the user scrolls
 * and maintains active status even when all headings are out of view
 *
 * @example
 * ```vue
 * <script setup>
 * const contentRef = ref(null);
 * const { activeHeadings, updateHeadings } = useScrollspy();
 *
 * onMounted(() => {
 *   // Get all heading elements in the content
 *   const headings = contentRef.value?.querySelectorAll('h2, h3, h4, h5, h6');
 *   if (headings?.length) {
 *     updateHeadings(headings);
 *   }
 * });
 * </script>
 *
 * <template>
 *   <div class="content" ref="contentRef">
 *     <!-- Content with headings -->
 *   </div>
 *   <nav class="table-of-contents">
 *     <a
 *       v-for="heading in headings"
 *       :key="heading.id"
 *       :href="`#${heading.id}`"
 *       :class="{ active: activeHeadings.includes(heading.id) }"
 *     >
 *       {{ heading.text }}
 *     </a>
 *   </nav>
 * </template>
 * ```
 *
 * @returns An object containing:
 *   - visibleHeadings: IDs of headings currently in viewport
 *   - activeHeadings: IDs of headings considered active
 *   - updateHeadings: Function to register headings to be observed
 */
export const useScrollspy = () => {
  const observer = ref<IntersectionObserver | undefined>();
  const visibleHeadings = ref<string[]>([]);
  const activeHeadings = ref<string[]>([]);

  const observerCallback = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      const id = entry.target.id;
      if (!id) {
        return;
      }
      if (entry.isIntersecting) {
        visibleHeadings.value = [...visibleHeadings.value, id];
      } else {
        visibleHeadings.value = visibleHeadings.value.filter((h) => h !== id);
      }
    });
  };

  const updateHeadings = (headings: Element[]) => {
    headings.forEach((heading) => {
      if (!observer.value) {
        return;
      }
      observer.value.observe(heading);
    });
  };

  watch(visibleHeadings, (val: string[], oldVal: string[]) => {
    if (val.length === 0) {
      activeHeadings.value = oldVal;
    } else {
      activeHeadings.value = val;
    }
  });

  onBeforeMount(
    () => (observer.value = new IntersectionObserver(observerCallback)),
  );
  onBeforeUnmount(() => observer.value?.disconnect());

  return {
    visibleHeadings,
    activeHeadings,
    updateHeadings,
  };
};
