import { afterEach, describe, expect, it } from "vitest";
import { defineComponent, h, nextTick } from "vue";
import { mount } from "@vue/test-utils";

import ECheckbox from "./index.vue";

type FocusableInputElement = {
  focus: () => void;
  blur: () => void;
};

const EDetailsStub = defineComponent({
  name: "EDetails",
  props: {
    id: {
      type: String,
      default: undefined,
    },
    details: {
      type: [String, Boolean],
      default: undefined,
    },
    hasError: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    return () =>
      h("div", {
        "data-testid": "details",
        id: props.id,
        "data-details": String(props.details ?? ""),
        "data-has-error": String(props.hasError),
      });
  },
});

const mountCheckbox = (props: Record<string, unknown> = {}) => {
  return mount(ECheckbox, {
    attachTo: document.body,
    props: {
      modelValue: false,
      detail: "Helper text",
      ...props,
    },
    global: {
      directives: {
        ripple: {},
      },
      stubs: {
        EDetails: EDetailsStub,
      },
    },
  });
};

afterEach(() => {
  document.body.innerHTML = "";
});

describe("ECheckbox", () => {
  it("emits only the semantic checkbox field classes from Vue", async () => {
    const wrapper = mountCheckbox();
    await nextTick();

    expect(wrapper.classes()).toContain("e-checkbox-field");
    expect(wrapper.find(".e-checkbox-field__control-shell").exists()).toBe(false);
    expect(wrapper.find(".e-field__frame").exists()).toBe(true);
    expect(wrapper.get(".e-checkbox-field__slot").classes()).toContain("e-field__slot");
    expect(wrapper.find(".e-field__control").exists()).toBe(true);
    expect(wrapper.find(".e-field__control-ripple").exists()).toBe(true);
  });

  it("toggles through the native input when the slot is clicked", async () => {
    const wrapper = mountCheckbox();
    await nextTick();

    await wrapper.get(".e-checkbox-field__slot").trigger("click");

    expect(wrapper.emitted("update:modelValue")).toEqual([[true]]);
  });

  it("wires supporting text to the control aria attributes", async () => {
    const wrapper = mountCheckbox();
    await nextTick();

    const input = wrapper.get('input[role="checkbox"]');
    const details = wrapper.get('[data-testid="details"]');

    expect(input.attributes("aria-describedby")).toBe(details.attributes("id"));
  });

  it("reflects focus state on the semantic visual control", async () => {
    const wrapper = mountCheckbox();
    await nextTick();

    const input = wrapper.get('input[role="checkbox"]');
    const inputElement = input.element as unknown as FocusableInputElement;
    const selectionControl = wrapper.get(".e-field__control");

    expect(selectionControl.attributes("data-focused")).toBe("false");

    inputElement.focus();
    await input.trigger("focus");
    await nextTick();
    expect(selectionControl.attributes("data-focused")).toBe("true");

    inputElement.blur();
    await input.trigger("blur");
    await nextTick();
    expect(selectionControl.attributes("data-focused")).toBe("false");
  });

  it("treats readonly as a non-interactive control state", async () => {
    const wrapper = mountCheckbox({ readonly: true });
    await nextTick();

    const input = wrapper.get('input[role="checkbox"]');

    expect(input.attributes("disabled")).toBeDefined();
    expect(input.attributes("aria-disabled")).toBe("true");
    expect(input.attributes("aria-readonly")).toBe("true");

    await wrapper.get(".e-checkbox-field__slot").trigger("click");

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });
});