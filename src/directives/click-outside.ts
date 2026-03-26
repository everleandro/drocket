import type { ObjectDirective, DirectiveBinding } from "vue";

type ClickOutsideHandler = (event: MouseEvent) => void;

type ClickOutsideTarget =
  | HTMLElement
  | null
  | undefined
  | { value?: HTMLElement | null | undefined }
  | (() => HTMLElement | null | undefined);

type ClickOutsideBindingValue =
  | ClickOutsideHandler
  | {
      handler: ClickOutsideHandler;
      include?: ClickOutsideTarget | Array<ClickOutsideTarget>;
      enabled?: boolean;
    };

type ClickOutsideOptions = {
  handler: ClickOutsideHandler;
  include: Array<ClickOutsideTarget>;
  bubble: boolean;
  enabled: boolean;
};

type ClickOutsideElement = HTMLElement & {
  __vueClickOutside__?: (event: MouseEvent) => void;
  __vueClickOutsideOptions__?: ClickOutsideOptions;
};

const resolveIncludeTarget = (
  target: ClickOutsideTarget,
): HTMLElement | null => {
  if (!target) return null;
  if (target instanceof HTMLElement) return target;
  if (typeof target === "function") return target() ?? null;
  if (typeof target === "object" && "value" in target) {
    const value = target.value;
    return value instanceof HTMLElement ? value : null;
  }
  return null;
};

const toIncludedElements = (
  include: ClickOutsideOptions["include"],
): Array<HTMLElement> => {
  return include
    .map((target) => resolveIncludeTarget(target))
    .filter((target): target is HTMLElement => target instanceof HTMLElement);
};

const isInsideElement = (element: HTMLElement, target: EventTarget | null): boolean => {
  return target instanceof Node && (element === target || element.contains(target));
};

const normalizeBindingValue = (
  binding: DirectiveBinding<ClickOutsideBindingValue>,
): ClickOutsideOptions | null => {
  const bubble = Boolean(binding.modifiers.bubble);

  if (typeof binding.value === "function") {
    return {
      handler: binding.value,
      include: [],
      bubble,
      enabled: true,
    };
  }

  if (
    binding.value &&
    typeof binding.value === "object" &&
    typeof binding.value.handler === "function"
  ) {
    return {
      handler: binding.value.handler,
      include: Array.isArray(binding.value.include)
        ? binding.value.include
        : binding.value.include
          ? [binding.value.include]
          : [],
      bubble,
      enabled: binding.value.enabled ?? true,
    };
  }

  console.warn(
    "[Vue-click-outside:] provided expression must be a function or an object with a handler function",
  );
  return null;
};

const setBindingOptions = (
  el: ClickOutsideElement,
  binding: DirectiveBinding<ClickOutsideBindingValue>,
): void => {
  el.__vueClickOutsideOptions__ = normalizeBindingValue(binding) ?? undefined;
};

export const clickOutside: ObjectDirective<ClickOutsideElement, ClickOutsideBindingValue> = {
  mounted(el, binding) {
    setBindingOptions(el, binding);

    const handler = (event: MouseEvent) => {
      const options = el.__vueClickOutsideOptions__;
      if (!options?.enabled) return;

      if (options.bubble) {
        options.handler(event);
        return;
      }

      const insideElements = [el, ...toIncludedElements(options.include)];
      const isInside = insideElements.some((element) => isInsideElement(element, event.target));

      if (!isInside) {
        options.handler(event);
      }
    };

    el.__vueClickOutside__ = handler;
    document.addEventListener("mousedown", handler);
  },
  updated(el, binding) {
    setBindingOptions(el, binding);
  },
  unmounted(el) {
    if (el.__vueClickOutside__) {
      document.removeEventListener("mousedown", el.__vueClickOutside__);
    }
    el.__vueClickOutside__ = undefined;
    el.__vueClickOutsideOptions__ = undefined;
  },
};

export default clickOutside;
