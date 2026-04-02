import { describe, expect, it } from "vitest";
import { defineComponent, h } from "vue";
import { mount } from "@vue/test-utils";

import EDatePicker from "./index.vue";

const EButtonStub = defineComponent({
  name: "EButton",
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["click"],
  setup(props, { attrs, emit, slots }) {
    return () =>
      h(
        "button",
        {
          ...attrs,
          class: attrs.class,
          disabled: props.disabled,
          type: "button",
          onClick: (event: MouseEvent) => emit("click", event),
        },
        slots.default?.(),
      );
  },
});

const mountDatePicker = (props: Record<string, unknown> = {}) => {
  return mount(EDatePicker, {
    props: {
      modelValue: new Date(2026, 2, 14),
      ...props,
    },
    global: {
      stubs: {
        EButton: EButtonStub,
      },
    },
  });
};

const getDayButton = (wrapper: ReturnType<typeof mountDatePicker>, day: number) => {
  return wrapper
    .findAll(".date-view .grid-body button")
    .find((button) => button.text() === String(day) && !button.classes().includes("e-picker-day--adjacent-month"));
};

const getSelectedDayButton = (wrapper: ReturnType<typeof mountDatePicker>) => {
  return wrapper
    .findAll(".date-view .grid-body button")
    .find((button) => button.classes().includes("e-picker-day--selected"));
};

describe("EDatePicker", () => {
  it("applies elevation to the picker container", () => {
    const wrapper = mountDatePicker({ elevation: "lg" });

    expect(wrapper.find(".e-picker").classes()).toContain("e-elevation--lg");
  });

  it("does not apply container elevation to the selected day button", () => {
    const wrapper = mountDatePicker({ elevation: "lg" });
    const selectedDay = getSelectedDayButton(wrapper);

    expect(selectedDay?.classes()).toContain("e-picker-day--selected");
    expect(selectedDay?.classes()).not.toContain("e-elevation--lg");
  });

  it("applies grid button elevation to the selected day button", () => {
    const wrapper = mountDatePicker({ gridButtonElevation: "lg" });
    const selectedDay = getSelectedDayButton(wrapper);

    expect(selectedDay?.classes()).toContain("e-picker-day--selected");
    expect(selectedDay?.classes()).toContain("e-elevation--lg");
  });
});