import type { VNode, Slot, VNodeArrayChildren, VNodeChild } from "vue";

/**
 * Type representing the complex structure of Vue slot children
 * with a default slot function and other possible properties
 */
interface SlotChildren {
  default?: Slot;
  [key: string]: unknown;
}

/**
 * Recursively extracts text content from Vue slot children
 * This utility is useful for converting slot content to plain text,
 * which can be used for accessibility, tooltips, or generating IDs.
 *
 * The function handles various Vue node structures:
 * - String or primitive children
 * - Array of VNodes
 * - Objects with a default slot function
 * - Nested slot structures
 *
 * @example
 * ```vue
 * <script setup>
 * const slots = useSlots();
 *
 * // Extract text from default slot
 * const buttonText = computed(() => {
 *   if (!slots.default) return '';
 *   return getSlotChildrenText(slots.default());
 * });
 *
 * // Use the text for aria-label if no explicit label is provided
 * const ariaLabel = computed(() => props.label || buttonText.value);
 * </script>
 * ```
 *
 * @param children - Array of VNodes from a slot
 * @returns The concatenated text content as a string
 */
export const getSlotChildrenText = (
  children: VNodeArrayChildren | VNodeChild[],
): string => {
  if (!Array.isArray(children)) {
    return "";
  }

  return children
    .map((node) => {
      // Skip non-object nodes (like strings, null, undefined)
      if (!node || typeof node !== "object") {
        return String(node || "");
      }

      // Ensure we're working with a VNode
      const vnode = node as VNode;
      // Handle case where children is a string or undefined
      if (!vnode.children || typeof vnode.children === "string") {
        return vnode.children || "";
      }
      // Handle case where children is an array of VNodes
      else if (Array.isArray(vnode.children)) {
        return getSlotChildrenText(vnode.children);
      }
      // Handle case where children has a default slot function
      else if (
        typeof vnode.children === "object" &&
        vnode.children !== null &&
        "default" in vnode.children &&
        typeof (vnode.children as SlotChildren).default === "function"
      ) {
        const defaultSlot = (vnode.children as SlotChildren).default as Slot;
        const slotContent = defaultSlot();
        return getSlotChildrenText(slotContent);
      }
      return "";
    })
    .join("");
};
