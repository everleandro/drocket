import { describe, expect, it } from "vitest";
import { nextTick } from "vue";
import { mount } from "@vue/test-utils";

import EProgressLinear from "./linear.vue";

const mountProgress = (props: Record<string, unknown> = {}) => {
  return mount(EProgressLinear, {
    attachTo: document.body,
    props,
  });
};

describe("EProgressLinear", () => {
  it("renders determinate mode by default with aria-valuenow set to 0", async () => {
    const wrapper = mountProgress();
    await nextTick();

    const progressbar = wrapper.get('[role="progressbar"]');

    expect(wrapper.classes()).not.toContain("e-progress-linear--active");
    expect(wrapper.find(".e-progress-linear__indeterminate").exists()).toBe(false);
    expect(wrapper.find(".e-progress-linear__determinate").exists()).toBe(true);
    expect(progressbar.attributes("aria-valuenow")).toBe("0");
  });

  it("renders indeterminate mode explicitly without aria-valuenow", async () => {
    const wrapper = mountProgress({ indeterminate: true });
    await nextTick();

    const progressbar = wrapper.get('[role="progressbar"]');

    expect(wrapper.classes()).toContain("e-progress-linear--active");
    expect(wrapper.find(".e-progress-linear__indeterminate").exists()).toBe(true);
    expect(wrapper.find(".e-progress-linear__determinate").exists()).toBe(false);
    expect(progressbar.attributes("aria-valuenow")).toBeUndefined();
  });

  it("renders determinate mode with the provided value", async () => {
    const wrapper = mountProgress({ indeterminate: false, value: 72 });
    await nextTick();

    const progressbar = wrapper.get('[role="progressbar"]');
    const determinate = wrapper.get(".e-progress-linear__determinate");

    expect(wrapper.classes()).not.toContain("e-progress-linear--active");
    expect(progressbar.attributes("aria-valuenow")).toBe("72");
    expect(determinate.attributes("style")).toContain("width: 72%");
  });

  it("clamps determinate values to the valid range", async () => {
    const lowWrapper = mountProgress({ indeterminate: false, value: -12 });
    await nextTick();

    expect(lowWrapper.get('[role="progressbar"]').attributes("aria-valuenow")).toBe("0");
    expect(lowWrapper.get(".e-progress-linear__determinate").attributes("style")).toContain("width: 0%");

    const highWrapper = mountProgress({ indeterminate: false, value: 160 });
    await nextTick();

    expect(highWrapper.get('[role="progressbar"]').attributes("aria-valuenow")).toBe("100");
    expect(highWrapper.get(".e-progress-linear__determinate").attributes("style")).toContain("width: 100%");
  });

  it("injects resolved color and normalized height through CSS variables", async () => {
    const wrapper = mountProgress({ color: "teal-900", height: 6 });
    await nextTick();

    const progressbar = wrapper.get('[role="progressbar"]');
    const style = progressbar.attributes("style");

    expect(style).toContain("--e-progress-linear-color");
    expect(style).toContain("--e-palette-teal-900");
    expect(style).toContain("--e-progress-linear-height: 6px");
  });
});