import { afterEach, describe, expect, it } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";
import { mount } from "@vue/test-utils";

import EForm from "../form.vue";
import ERadio from "./index.vue";
import ERadioGroup from "./group.vue";

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

const mountRadioGroup = (groupProps: Record<string, unknown> = {}) => {
  const Host = defineComponent({
    components: {
      ERadio,
      ERadioGroup,
    },
    setup() {
      const model = ref<string | null>("email");

      return {
        model,
      };
    },
    template: `
      <ERadioGroup v-model="model" label="Channel" detail="Helper text" v-bind="$attrs">
        <ERadio model-value="email" label="Email" />
        <ERadio model-value="slack" label="Slack" />
      </ERadioGroup>
    `,
  });

  return mount(Host, {
    attachTo: document.body,
    attrs: groupProps,
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

const mountRadioGroupInForm = (formProps: Record<string, unknown> = {}) => {
  const Host = defineComponent({
    components: {
      EForm,
      ERadio,
      ERadioGroup,
    },
    setup() {
      const model = ref<string | null>(null);

      return {
        model,
      };
    },
    template: `
      <EForm v-bind="$attrs">
        <ERadioGroup v-model="model" label="Channel">
          <ERadio model-value="email" label="Email" />
          <ERadio model-value="slack" label="Slack" />
        </ERadioGroup>
      </EForm>
    `,
  });

  return mount(Host, {
    attachTo: document.body,
    attrs: formProps,
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

describe("ERadioGroup", () => {
  it("emits only the semantic radio-group field classes from Vue", async () => {
    const wrapper = mountRadioGroup();
    await nextTick();

    const root = wrapper.get(".e-radio-group-field");
    const group = wrapper.get('[role="radiogroup"]');

    expect(root.classes()).toContain("e-radio-group-field");
    expect(root.classes()).toContain("e-radio-group-field--column");
    expect(root.classes()).not.toContain("e-field--radio-group");
    expect(root.classes()).not.toContain("e-field--radio-group--column");
    expect(group.classes()).toContain("e-radio-group-field__group");
    expect(group.classes()).not.toContain("e-field--radio-group__field");
  });

  it("moves the visual focus state to the radio that actually receives focus", async () => {
    const wrapper = mountRadioGroup();
    await nextTick();

    const inputs = wrapper.findAll('input[role="radio"]');
    const controls = wrapper.findAll(".e-radio__control");

    expect(controls[0].attributes("data-focused")).toBe("false");
    expect(controls[1].attributes("data-focused")).toBe("false");

    (inputs[1].element as HTMLInputElement).focus();
    await inputs[1].trigger("focus");
    await nextTick();

    expect(controls[0].attributes("data-focused")).toBe("false");
    expect(controls[1].attributes("data-focused")).toBe("true");

    (inputs[0].element as HTMLInputElement).focus();
    await inputs[0].trigger("focus");
    await nextTick();

    expect(controls[0].attributes("data-focused")).toBe("true");
    expect(controls[1].attributes("data-focused")).toBe("false");
  });

  it("wires supporting text and state to the radiogroup aria attributes", async () => {
    const wrapper = mountRadioGroup({ detailErrors: ["Required selection"] });
    await nextTick();

    const radioGroup = wrapper.get('[role="radiogroup"]');
    const details = wrapper.get('[data-testid="details"]');

    expect(radioGroup.attributes("aria-describedby")).toBe(details.attributes("id"));
    expect(radioGroup.attributes("aria-invalid")).toBe("true");
    expect(details.attributes("data-has-error")).toBe("true");
  });

  it("initializes mandatory selection only when there is no valid value", async () => {
    const Host = defineComponent({
      components: {
        ERadio,
        ERadioGroup,
      },
      setup() {
        const model = ref<string | null>(null);

        return {
          model,
        };
      },
      template: `
        <ERadioGroup v-model="model" mandatory>
          <ERadio model-value="email" label="Email" />
          <ERadio model-value="slack" label="Slack" />
        </ERadioGroup>
      `,
    });

    const wrapper = mount(Host, {
      attachTo: document.body,
      global: {
        directives: {
          ripple: {},
        },
        stubs: {
          EDetails: EDetailsStub,
        },
      },
    });

    await nextTick();
    await nextTick();

    expect(wrapper.vm.model).toBe("email");
  });

  it("does not override an existing valid value when mandatory is enabled", async () => {
    const Host = defineComponent({
      components: {
        ERadio,
        ERadioGroup,
      },
      setup() {
        const model = ref<string | null>("slack");

        return {
          model,
        };
      },
      template: `
        <ERadioGroup v-model="model" mandatory>
          <ERadio model-value="email" label="Email" />
          <ERadio model-value="slack" label="Slack" />
        </ERadioGroup>
      `,
    });

    const wrapper = mount(Host, {
      attachTo: document.body,
      global: {
        directives: {
          ripple: {},
        },
        stubs: {
          EDetails: EDetailsStub,
        },
      },
    });

    await nextTick();
    await nextTick();

    expect(wrapper.vm.model).toBe("slack");
  });

  it("inherits disabled state from EForm immediately on mount", async () => {
    const wrapper = mountRadioGroupInForm({ disabled: true });
    await nextTick();
    await nextTick();

    const radioGroup = wrapper.get('[role="radiogroup"]');
    const inputs = wrapper.findAll('input[role="radio"]');

    expect(radioGroup.attributes("aria-disabled")).toBe("true");
    expect(inputs[0].attributes("disabled")).toBeDefined();
    expect(inputs[1].attributes("disabled")).toBeDefined();
  });

  it("does not initialize mandatory selection while readonly from EForm", async () => {
    const Host = defineComponent({
      components: {
        EForm,
        ERadio,
        ERadioGroup,
      },
      setup() {
        const model = ref<string | null>(null);

        return {
          model,
        };
      },
      template: `
        <EForm readonly>
          <ERadioGroup v-model="model" mandatory>
            <ERadio model-value="email" label="Email" />
            <ERadio model-value="slack" label="Slack" />
          </ERadioGroup>
        </EForm>
      `,
    });

    const wrapper = mount(Host, {
      attachTo: document.body,
      global: {
        directives: {
          ripple: {},
        },
        stubs: {
          EDetails: EDetailsStub,
        },
      },
    });

    await nextTick();
    await nextTick();

    expect(wrapper.vm.model).toBe(null);
  });
});