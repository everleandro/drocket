import { afterEach, describe, expect, it } from "vitest";
import { defineComponent, h, nextTick } from "vue";
import { mount } from "@vue/test-utils";

import ESelect from "./index.vue";

if (!HTMLElement.prototype.scrollIntoView) {
  HTMLElement.prototype.scrollIntoView = () => undefined;
}

const EMenuStub = defineComponent({
  name: "EMenu",
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots }) {
    return () =>
      h("div", { "data-testid": "menu" }, [
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
    return () => h("span", { "data-testid": "icon" });
  },
});

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
    showDetails: {
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
        "data-show-details": String(props.showDetails),
      });
  },
});

const EChipStub = defineComponent({
  name: "EChip",
  setup(_, { slots }) {
    return () => h("div", { "data-testid": "chip" }, slots.default?.());
  },
});

const EListStub = defineComponent({
  name: "EList",
  setup(_, { slots, attrs }) {
    return () => h("div", attrs, slots.default?.());
  },
});

const EListItemStub = defineComponent({
  name: "EListItem",
  setup(_, { slots, attrs }) {
    return () => h("div", attrs, slots.default?.());
  },
});

const EProgressLinearStub = defineComponent({
  name: "EProgressLinear",
  setup(_, { attrs }) {
    return () => h("div", { ...attrs, "data-testid": "progress-linear" });
  },
});

const mountSelect = (props: Record<string, unknown> = {}) => {
  return mount(ESelect, {
    attachTo: document.body,
    props: {
      modelValue: null,
      label: "Channel",
      detail: "Helper text",
      items: ["Email", "Slack"],
      ...props,
    },
    global: {
      stubs: {
        EMenu: EMenuStub,
        EButton: EButtonStub,
        EIcon: EIconStub,
        EDetails: EDetailsStub,
        EChip: EChipStub,
        EList: EListStub,
        EListItem: EListItemStub,
        EProgressLinear: EProgressLinearStub,
      },
    },
  });
};

afterEach(() => {
  document.body.innerHTML = "";
});

describe("ESelect", () => {
  it("emits only the semantic select field anatomy for its internal structure", async () => {
    const wrapper = mountSelect();
    await nextTick();

    expect(wrapper.classes()).toContain("e-select");
    expect(wrapper.classes()).toContain("e-select-field");
    expect(wrapper.get(".e-select-field__control").classes()).toContain("e-field__control");
    expect(wrapper.get(".e-select-field__slot").classes()).toContain("e-field__slot");
    expect(wrapper.get(".e-select-field__body").classes()).not.toContain("e-select__slot");
    expect(wrapper.get(".e-select-field__selections").classes()).not.toContain("e-select__selections");
    expect(wrapper.get(".e-select-field__input").attributes("role")).toBe("combobox");
    expect(wrapper.find(".e-select-field__append").exists()).toBe(true);
    expect(wrapper.find(".e-select__selection").exists()).toBe(false);
    expect(wrapper.find(".e-select__menu-content").exists()).toBe(false);
  });

  it("emits semantic select affordance wrappers", async () => {
    const wrapper = mountSelect({
      prependIcon: "$check",
      appendIcon: "$check",
      clearable: true,
      modelValue: "one",
    });
    await nextTick();

    expect(wrapper.find(".e-select-field__prepend").exists()).toBe(true);
    expect(wrapper.find(".e-select-field__clear").exists()).toBe(true);
    expect(wrapper.findAll(".e-select-field__append")).toHaveLength(2);
  });

  it("wires supporting text and error state to the combobox aria attributes", async () => {
    const wrapper = mountSelect({ detailErrors: ["Required selection"] });
    await nextTick();

    const input = wrapper.get('input[role="combobox"]');
    const details = wrapper.get('[data-testid="details"]');

    expect(input.attributes("aria-describedby")).toBe(details.attributes("id"));
    expect(input.attributes("aria-invalid")).toBe("true");
    expect(details.attributes("data-has-error")).toBe("true");
  });

  it("opens the menu and updates the combobox expanded state when the slot is clicked", async () => {
    const wrapper = mountSelect();
    await nextTick();

    const input = wrapper.get('input[role="combobox"]');
    expect(input.attributes("aria-expanded")).toBe("false");
    expect(wrapper.find(".e-select-field__menu-content").exists()).toBe(false);

    await wrapper.get(".e-select-field__slot").trigger("click");
    await nextTick();

    expect(input.attributes("aria-expanded")).toBe("true");
    expect(wrapper.find(".e-select-field__menu-content").exists()).toBe(true);
    expect(wrapper.get('[role="listbox"]').attributes("id")).toBe(input.attributes("aria-controls"));
  });

  it("shows loading state without dropping the semantic field root", async () => {
    const wrapper = mountSelect({ loading: true });
    await nextTick();

    expect(wrapper.classes()).toContain("e-select-field");
    expect(wrapper.classes()).toContain("e-select--loading");
    expect(wrapper.find('[data-testid="progress-linear"]').exists()).toBe(true);
  });
});