export const ripple = {
  mounted: function (el: any, binding: Record<string, any>) {
    if (!el.classList.contains("v-ripple-element"))
      el.classList.add("v-ripple-element");
    if (!(binding?.value?.disabled === true))
      el.addEventListener("mousedown", function (e: MouseEvent) {
        if (!el.classList.contains("v-ripple-element"))
          el.classList.add("v-ripple-element");
        const circle = document.createElement("span");
        el.appendChild(circle);
        const DOMRect = el.getBoundingClientRect();
        const diameter = Math.max(DOMRect.width, DOMRect.height);
        const radius = diameter / 2;
        const color = binding?.value?.color || getComputedStyle(el).color;
        const background = color || "rgb(255, 255, 255)";
        circle.style.width = circle.style.height = diameter + "px";
        circle.style.animationDuration = "0.5s";
        circle.style.backgroundColor = background;

        const center = !!binding?.value?.center;

        circle.style.left = center
          ? "0px"
          : e.clientX - (DOMRect.left + radius) + "px";

        circle.style.top = center
          ? "0px"
          : e.clientY - (DOMRect.top + radius) + "px";

        circle.classList.add("v-ripple");
        setTimeout(() => {
          if (circle) el.removeChild(circle);
        }, 500);
      });
  },
  updated: function (el: any) {
    if (!el.classList.contains("v-ripple-element"))
      el.classList.add("v-ripple-element");
  },
};
export default ripple;
