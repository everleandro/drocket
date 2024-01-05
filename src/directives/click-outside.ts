export const clickOutside = {
  mounted: function (el: any, binding: Record<string, any>) {
    if (typeof binding.value !== "function") {
      console.warn(
        `[Vue-click-outside:] provided expression is not a function, but has to be`
      );
    }
    // Define Handler and cache it on the element
    const bubble = binding.modifiers.bubble;
    const handler = (e: any) => {
      if (bubble || (!el.contains(e.target) && el !== e.target)) {
        binding.value(e);
      }
    };
    el.__vueClickOutside__ = handler;
    // add Event Listeners
    document.addEventListener("mousedown", handler);
  },
  unmounted: function (el: any) {
    // Remove Event Listeners
    document.removeEventListener("mousedown", el.__vueClickOutside__);
    el.__vueClickOutside__ = null;
  },
};
export default clickOutside;
