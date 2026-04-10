export type FocusableElement = {
  focus: () => void;
  blur?: () => void;
};

const tabbableSelector = [
  "a[href]",
  "area[href]",
  "button",
  "input:not([type='hidden'])",
  "select",
  "textarea",
  "iframe",
  "[tabindex]",
  "[contenteditable='true']",
].join(", ");

const isHiddenByAncestors = (element: HTMLElement): boolean => {
  return Boolean(element.closest("[hidden], [inert], [aria-hidden='true']"));
};

const isVisibleElement = (element: HTMLElement): boolean => {
  if (typeof window === "undefined") return true;

  const style = window.getComputedStyle(element);

  return style.display !== "none" && style.visibility !== "hidden";
};

const isTabbableElement = (element: HTMLElement): boolean => {
  if (isHiddenByAncestors(element) || !isVisibleElement(element)) {
    return false;
  }

  if ("disabled" in element && (element as HTMLButtonElement).disabled) {
    return false;
  }

  return element.tabIndex >= 0;
};

const isElementAfterAnchor = (anchor: Element, candidate: HTMLElement): boolean => {
  return Boolean(anchor.compareDocumentPosition(candidate) & Node.DOCUMENT_POSITION_FOLLOWING);
};

const isElementBeforeAnchor = (anchor: Element, candidate: HTMLElement): boolean => {
  return Boolean(anchor.compareDocumentPosition(candidate) & Node.DOCUMENT_POSITION_PRECEDING);
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
  selector: string | Array<string>,
): FocusableElement | undefined => {
  if (!rootElement) return undefined;

  const selectors = Array.isArray(selector) ? selector : [selector];

  for (const currentSelector of selectors) {
    const element = rootElement.querySelector<HTMLElement>(currentSelector);

    if (element) {
      return resolveFocusableElement(element);
    }
  }

  return undefined;
};

export const isDomFocused = (element?: FocusableElement): boolean => {
  if (!element || typeof document === "undefined") return false;
  return element instanceof Element && document.activeElement === element;
};

export const getTabbables = (
  container: ParentNode = document,
): Array<HTMLElement> => {
  if (typeof document === "undefined") return [];

  return Array.from(container.querySelectorAll<HTMLElement>(tabbableSelector)).filter(
    isTabbableElement,
  );
};

export const getNextTabbable = (
  anchor: Element,
  container: ParentNode = document,
): HTMLElement | undefined => {
  return getTabbables(container).find((candidate) => {
    if (candidate === anchor || anchor.contains(candidate)) {
      return false;
    }

    return isElementAfterAnchor(anchor, candidate);
  });
};

export const getPrevTabbable = (
  anchor: Element,
  container: ParentNode = document,
): HTMLElement | undefined => {
  return [...getTabbables(container)].reverse().find((candidate) => {
    if (candidate === anchor || anchor.contains(candidate)) {
      return false;
    }

    return isElementBeforeAnchor(anchor, candidate);
  });
};