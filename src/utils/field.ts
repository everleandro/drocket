export type FocusableElement = {
  focus: () => void;
  blur?: () => void;
};

export const hasFieldValue = (value: unknown): boolean => {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.length > 0;
  if (Array.isArray(value)) return value.length > 0;

  return true;
};

export const resolveFocusableElement = (
  target: unknown,
): FocusableElement | undefined => {
  if (!target) return undefined;

  if (Array.isArray(target)) {
    for (const item of target) {
      const element = resolveFocusableElement(item);
      if (element) return element;
    }

    return undefined;
  }

  if (
    typeof target === "object" &&
    target !== null &&
    "focus" in target &&
    typeof (target as FocusableElement).focus === "function"
  ) {
    return target as FocusableElement;
  }

  if (typeof target === "object" && target !== null && "$el" in target) {
    return resolveFocusableElement((target as { $el?: unknown }).$el);
  }

  return undefined;
};

export const getFocusableElementInRoot = (
  rootElement: ParentNode | null | undefined,
  selector: string,
): FocusableElement | undefined => {
  if (!rootElement) return undefined;

  const element = rootElement.querySelector<HTMLElement>(selector);
  return element ? resolveFocusableElement(element) : undefined;
};

export const isDomFocused = (element?: FocusableElement): boolean => {
  if (!element || typeof document === "undefined") return false;
  return element instanceof Element && document.activeElement === element;
};