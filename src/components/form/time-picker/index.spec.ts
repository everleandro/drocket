import { describe, expect, it } from "vitest";
import { defineComponent, h, nextTick } from "vue";
import { mount } from "@vue/test-utils";
import ETimePicker from "./index.vue";

const EMenuStub = defineComponent({
  name: "EMenu",
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots }) {
    return () => h("div", [
      slots.activator?.({ ref: () => undefined }),
      props.modelValue ? slots.default?.() : null,
    ]);
  },
});

const EButtonStub = defineComponent({
  name: "EButton",
  setup(_, { slots, attrs }) {
    return () => h("button", { ...attrs, type: "button" }, slots.default?.());
  },
});

const EIconStub = defineComponent({
  name: "EIcon",
  setup() {
    return () => h("span");
  },
});

const EDetailsStub = defineComponent({
  name: "EDetails",
  props: {
    id: {
      type: String,
      default: undefined,
    },
  },
  setup(props) {
    return () => h("div", { "data-testid": "details", id: props.id });
  },
});

const mountTimePicker = (props: Record<string, unknown> = {}) => {
  return mount(ETimePicker, {
    props: {
      modelValue: new Date("2026-03-26T10:30:00.000Z"),
      label: "Time",
      details: "Choose a time",
      ...props,
    },
    global: {
      stubs: {
        EMenu: EMenuStub,
        EButton: EButtonStub,
        EIcon: EIconStub,
        EDetails: EDetailsStub,
      },
    },
  });
};

describe("ETimePicker", () => {
  it("emits semantic time picker anatomy from Vue", async () => {
    const wrapper = mountTimePicker({ appendIcon: "$check", prependIcon: "$check" });
    await nextTick();

    expect(wrapper.classes()).toContain("e-time-picker");
    expect(wrapper.get(".e-time-picker__control").classes()).toContain("e-field__control");
    expect(wrapper.get(".e-time-picker__slot").classes()).toContain("e-field__slot");
    expect(wrapper.find(".e-time-picker__body").exists()).toBe(true);
    expect(wrapper.find(".e-time-picker__group").exists()).toBe(true);
    expect(wrapper.findAll(".e-time-picker__input")).toHaveLength(2);
    expect(wrapper.findAll(".e-time-picker__append").length).toBeGreaterThanOrEqual(1);
    expect(wrapper.find(".e-time-picker__prepend").exists()).toBe(true);

    const details = wrapper.get('[data-testid="details"]');
    expect(wrapper.get('input[data-hours]').attributes("aria-describedby")).toBe(details.attributes("id"));
    expect(wrapper.get('input[data-minutes]').attributes("aria-describedby")).toBe(details.attributes("id"));

    await wrapper.get('input[data-hours]').trigger("focus");

    expect(wrapper.findAll(".e-time-picker__menu-segment")).toHaveLength(2);
    expect(wrapper.findAll(".e-time-picker__menu-value")).toHaveLength(2);
    expect(wrapper.find(".time-info").exists()).toBe(false);
  });

  it("keeps the menu open when blur is caused by an internal menu mousedown", async () => {
    const wrapper = mountTimePicker();

    const hoursInput = wrapper.get('input[data-hours]');
    await hoursInput.trigger("focus");
    expect(wrapper.find(".e-time-picker__menu-content").exists()).toBe(true);

    const menuContent = wrapper.get(".e-time-picker__menu-content");
    menuContent.element.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    hoursInput.element.dispatchEvent(new FocusEvent("blur", { relatedTarget: null }));

    await nextTick();
    await Promise.resolve();

    expect(wrapper.find(".e-time-picker__menu-content").exists()).toBe(true);
    expect(wrapper.classes()).toContain("e-time-picker--is-open");
  });

  it("still closes after a later real blur outside the widget", async () => {
    const wrapper = mountTimePicker();

    const hoursInput = wrapper.get('input[data-hours]');
    await hoursInput.trigger("focus");

    const menuContent = wrapper.get(".e-time-picker__menu-content");
    menuContent.element.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    hoursInput.element.dispatchEvent(new FocusEvent("blur", { relatedTarget: null }));

    await nextTick();
    await Promise.resolve();
    await new Promise((resolve) => setTimeout(resolve, 0));

    hoursInput.element.dispatchEvent(new FocusEvent("blur", { relatedTarget: document.body }));

    await nextTick();
    await Promise.resolve();

    expect(wrapper.find(".e-time-picker__menu-content").exists()).toBe(false);
    expect(wrapper.classes()).not.toContain("e-time-picker--is-open");
  });
});