import type { DirectiveBinding, ObjectDirective } from "vue";

type FocusOutsideHandler = (event: FocusEvent) => void;

type FocusOutsideTarget =
  | HTMLElement
  | null
  | undefined
  | { $el?: HTMLElement | null | undefined }
  | { value?: HTMLElement | null | undefined | { $el?: HTMLElement | null | undefined } }
  | (() => HTMLElement | null | undefined | { $el?: HTMLElement | null | undefined });

type FocusOutsideBindingValue =
  | FocusOutsideHandler
  | {
      handler: FocusOutsideHandler;
      include?: FocusOutsideTarget | Array<FocusOutsideTarget>;
      enabled?: boolean;
    };

type FocusOutsideOptions = {
  handler: FocusOutsideHandler;
  include: Array<FocusOutsideTarget>;
  enabled: boolean;
};

type FocusOutsideElement = HTMLElement & {
  __vueFocusOutside__?: (event: FocusEvent) => void;
  __vueFocusOutsideOptions__?: FocusOutsideOptions;
};

const resolveElementCandidate = (target: unknown): HTMLElement | null => {
  if (target instanceof HTMLElement) return target;

  if (
    target &&
    typeof target === "object" &&
    "$el" in target &&
    target.$el instanceof HTMLElement
  ) {
    return target.$el;
  }

  return null;
};

const resolveIncludeTarget = (
  target: FocusOutsideTarget,
): HTMLElement | null => {
  if (!target) return null;

  const resolvedTarget = typeof target === "function" ? target() : target;
  const resolvedElement = resolveElementCandidate(resolvedTarget);

  if (resolvedElement) {
    return resolvedElement;
  }

  if (
    resolvedTarget &&
    typeof resolvedTarget === "object" &&
    "value" in resolvedTarget
  ) {
    return resolveElementCandidate(resolvedTarget.value);
  }

  return null;
};

const toIncludedElements = (
  include: FocusOutsideOptions["include"],
): Array<HTMLElement> => {
  return include
    .map((target) => resolveIncludeTarget(target))
    .filter((target): target is HTMLElement => target instanceof HTMLElement);
};

const isInsideElement = (element: HTMLElement, target: EventTarget | null): boolean => {
  return target instanceof Node && (element === target || element.contains(target));
};

const normalizeBindingValue = (
  binding: DirectiveBinding<FocusOutsideBindingValue>,
): FocusOutsideOptions | null => {
  if (typeof binding.value === "function") {
    return {
      handler: binding.value,
      include: [],
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
      enabled: binding.value.enabled ?? true,
    };
  }

  console.warn(
    "[Vue-focus-outside:] provided expression must be a function or an object with a handler function",
  );
  return null;
};

const setBindingOptions = (
  el: FocusOutsideElement,
  binding: DirectiveBinding<FocusOutsideBindingValue>,
): void => {
  el.__vueFocusOutsideOptions__ = normalizeBindingValue(binding) ?? undefined;
};

export const focusOutside: ObjectDirective<FocusOutsideElement, FocusOutsideBindingValue> = {
  mounted(el, binding) {
    setBindingOptions(el, binding);

    const handler = (event: FocusEvent) => {
      const options = el.__vueFocusOutsideOptions__;
      if (!options?.enabled) return;

      const insideElements = [el, ...toIncludedElements(options.include)];
      const wasInside = insideElements.some((element) => isInsideElement(element, event.target));

      if (!wasInside) {
        return;
      }

      const isStillInside = insideElements.some((element) => isInsideElement(element, event.relatedTarget));

      if (!isStillInside) {
        options.handler(event);
      }
    };

    el.__vueFocusOutside__ = handler;
    document.addEventListener("focusout", handler);
  },
  updated(el, binding) {
    setBindingOptions(el, binding);
  },
  unmounted(el) {
    if (el.__vueFocusOutside__) {
      document.removeEventListener("focusout", el.__vueFocusOutside__);
    }

    el.__vueFocusOutside__ = undefined;
    el.__vueFocusOutsideOptions__ = undefined;
  },
};

export default focusOutside;