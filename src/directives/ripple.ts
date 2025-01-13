interface El extends HTMLElement {
  __rippleHandler__?: (e: MouseEvent) => void;
}
export interface RippleBinding {
  color?: string;
  event?: "pointerdown" | "mousedown" | "click";
  center?: boolean;
  disabled?: boolean;
}
const createRippleHandler = (
  el: El,
  binding?: Record<"value", RippleBinding>
) => {
  return (e: MouseEvent) => {
    e.stopPropagation(); // Asegurarse de que el evento alcance el elemento

    if (binding?.value?.disabled) return;

    if (!el.classList.contains("v-ripple-element")) {
      el.classList.add("v-ripple-element");
    }

    const circle = document.createElement("span");
    el.appendChild(circle);

    const rect = el.getBoundingClientRect();
    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;

    const color = binding?.value?.color || getComputedStyle(el).color;
    const background = color || "rgb(255, 255, 255)";
    const center = !!binding?.value?.center;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.backgroundColor = background;
    circle.style.animationDuration = "0.5s";
    circle.style.position = "absolute";
    circle.style.borderRadius = "50%";
    circle.style.pointerEvents = "none";
    circle.style.left = center
      ? `${(rect.width - diameter) / 2}px`
      : `${e.clientX - rect.left - radius}px`;
    circle.style.top = center
      ? `${(rect.height - diameter) / 2}px`
      : `${e.clientY - rect.top - radius}px`;
    circle.classList.add("v-ripple");

    setTimeout(() => {
      if (circle.parentElement) circle.parentElement.removeChild(circle);
    }, 500);
  };
};

export const ripple = {
  mounted(el: El, binding?: Record<"value", RippleBinding>) {
    if (!el.classList.contains("v-ripple-element")) {
      el.classList.add("v-ripple-element");
    }

    el.__rippleHandler__ = createRippleHandler(el, binding);
    el.addEventListener(
      binding?.value?.event || "pointerdown",
      el.__rippleHandler__
    );
  },

  updated(el: El, binding?: Record<"value", RippleBinding>) {
    if (binding?.value?.disabled && el.__rippleHandler__) {
      el.removeEventListener(
        binding?.value?.event || "pointerdown",
        el.__rippleHandler__
      );
    } else if (!binding?.value?.disabled && !el.__rippleHandler__) {
      el.__rippleHandler__ = createRippleHandler(el, binding);
      el.addEventListener(
        binding?.value?.event || "pointerdown",
        el.__rippleHandler__
      );
    }
  },

  unmounted(el: El, binding: Record<string, any>) {
    if (el.__rippleHandler__) {
      el.removeEventListener(
        binding.event || "pointerdown",
        el.__rippleHandler__
      );
      delete el.__rippleHandler__;
    }
  },
};

export default ripple;
