import { afterEach, describe, expect, it } from "vitest";
import { defineComponent, h, nextTick } from "vue";
import { mount } from "@vue/test-utils";
import ESwitch from "./index.vue";

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

const mountSwitch = (props: Record<string, unknown> = {}) => {
  return mount(ESwitch, {
    attachTo: document.body,
    props: {
      modelValue: false,
      detail: "Helper text",
      ...props,
    },
    global: {
      stubs: {
        EDetails: EDetailsStub,
      },
    },
  });
};

afterEach(() => {
  document.body.innerHTML = "";
});

describe("ESwitch", () => {
  it("emits only the semantic switch field classes from Vue", async () => {
    const wrapper = mountSwitch({ loading: true });
    await nextTick();

    expect(wrapper.classes()).toContain("e-switch-field");
    expect(wrapper.classes()).toContain("e-switch-field--loading");
    expect(wrapper.get(".e-switch-field__control-shell").classes()).toContain("e-field__control");
    expect(wrapper.get(".e-switch-field__slot").classes()).toContain("e-field__slot");
    expect(wrapper.classes()).not.toContain("e-field-switch");
    expect(wrapper.classes()).not.toContain("e-field-switch--loading");
  });

  it("toggles through the native input when the slot is clicked", async () => {
    const wrapper = mountSwitch();
    await nextTick();

    await wrapper.get(".e-switch-field__slot").trigger("click");

    expect(wrapper.emitted("update:modelValue")).toEqual([[true]]);
  });

  it("wires supporting text to the control aria attributes", async () => {
    const wrapper = mountSwitch();
    await nextTick();

    const input = wrapper.get('input[role="switch"]');
    expect(input.attributes("aria-describedby")).toBeTruthy();

    const details = wrapper.get('[data-testid="details"]');
    expect(details.attributes("id")).toBe(input.attributes("aria-describedby"));
  });

  it("reflects focus state on the visual selection control", async () => {
    const wrapper = mountSwitch();
    await nextTick();

    const input = wrapper.get('input[role="switch"]');
    const inputElement = input.element as unknown as FocusableInputElement;
    const selectionControl = wrapper.get(".e-switch-field__control");

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
    const wrapper = mountSwitch({ readonly: true });
    await nextTick();

    const input = wrapper.get('input[role="switch"]');

    expect(input.attributes("disabled")).toBeDefined();
    expect(input.attributes("aria-disabled")).toBe("true");
    expect(input.attributes("aria-readonly")).toBe("true");

    await wrapper.get(".e-switch-field__slot").trigger("click");

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("treats loading as an effectively disabled state", async () => {
    const wrapper = mountSwitch({ loading: true });
    await nextTick();

    const input = wrapper.get('input[role="switch"]');
    expect(input.attributes("disabled")).toBeDefined();
    expect(input.attributes("aria-disabled")).toBe("true");
    expect(input.attributes("aria-busy")).toBe("true");
    expect(wrapper.classes()).toContain("e-switch-field--loading");
    expect(wrapper.find('[role="progressbar"]').exists()).toBe(false);

    const spinner = wrapper.get(".e-progress-circular");
    expect(spinner.attributes("aria-hidden")).toBe("true");

    await wrapper.get(".e-switch-field__slot").trigger("click");

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });
});