import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import EButton from "./index.vue";

describe("EButton", () => {
  it("uses the default elevated class when no explicit elevation is provided", () => {
    const wrapper = mount(EButton, {
      slots: {
        default: "Save",
      },
    });

    expect(wrapper.classes()).toContain("e-btn--elevated");
    expect(wrapper.classes()).not.toContain("e-elevation--sm");
  });

  it("applies an explicit elevation class when provided", () => {
    const wrapper = mount(EButton, {
      props: {
        elevation: "lg",
      },
      slots: {
        default: "Save",
      },
    });

    expect(wrapper.classes()).toContain("e-elevation--lg");
    expect(wrapper.classes()).not.toContain("e-btn--elevated");
  });

  it("supports elevation none to force a flat contained button", () => {
    const wrapper = mount(EButton, {
      props: {
        elevation: "none",
      },
      slots: {
        default: "Save",
      },
    });

    expect(wrapper.classes()).not.toContain("e-btn--elevated");
    expect(wrapper.classes().some((className) => className.startsWith("e-elevation--"))).toBe(false);
  });
});