import { afterEach, describe, expect, it } from "vitest";
import { defineComponent, h, nextTick } from "vue";
import { mount } from "@vue/test-utils";

import { ScheduleMode, type ScheduleEvent, type ScheduleSpace } from "@/types";

import ESchedule from "./index.vue";

const EButtonStub = defineComponent({
  name: "EButton",
  props: {
    color: {
      type: String,
      default: undefined,
    },
    text: {
      type: Boolean,
      default: false,
    },
    depressed: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["click"],
  setup(_, { attrs, emit, slots }) {
    return () =>
      h(
        "button",
        {
          ...attrs,
          type: "button",
          onClick: (event: MouseEvent) => emit("click", event),
        },
        slots.default?.(),
      );
  },
});

const EIconStub = defineComponent({
  name: "EIcon",
  setup(_, { attrs }) {
    return () => h("span", attrs);
  },
});

const EProgressLinearStub = defineComponent({
  name: "EProgressLinear",
  setup(_, { attrs }) {
    return () => h("div", attrs);
  },
});

const spaces: ScheduleSpace[] = [
  { id: "room-a", label: "Room A" },
  { id: "room-b", label: "Room B" },
];

const modelValue = new Date(2024, 0, 2, 0, 0, 0);

const mountSchedule = (props: Record<string, unknown> = {}) => {
  return mount(ESchedule, {
    attachTo: document.body,
    props: {
      modelValue,
      mode: ScheduleMode.day,
      spaces,
      start: 9 * 60 * 60,
      end: 11 * 60 * 60,
      step: 60 * 60,
      ...props,
    },
    global: {
      directives: {
        ripple: {},
      },
      stubs: {
        EButton: EButtonStub,
        EIcon: EIconStub,
        EProgressLinear: EProgressLinearStub,
      },
    },
  });
};

afterEach(() => {
  document.body.innerHTML = "";
});

describe("ESchedule", () => {
  it("exposes loading state on the schedule region without fake grid roles", async () => {
    const wrapper = mountSchedule({ loading: true });
    await nextTick();

    const region = wrapper.get('[role="region"]');

    expect(region.attributes("aria-busy")).toBe("true");
    expect(wrapper.find('[role="col"]').exists()).toBe(false);
    expect(wrapper.find('[role="cell"]').exists()).toBe(false);
  });

  it("falls back to the first space when day mode has no selectedSpace", async () => {
    const events: ScheduleEvent[] = [
      {
        entityId: "room-a",
        name: "Checkup",
        start: new Date(2024, 0, 2, 9, 0, 0),
        end: new Date(2024, 0, 2, 10, 0, 0),
        color: "primary",
      },
    ];

    const wrapper = mountSchedule({ events });
    await nextTick();
    await nextTick();

    const eventButton = wrapper.get("button.e-schedule__event-container");

    expect(eventButton.text()).toContain("Checkup");
    expect(eventButton.attributes("aria-label")).toContain("Checkup");
  });

  it("renders default events as buttons and emits click:event", async () => {
    const event: ScheduleEvent = {
      entityId: "room-a",
      name: "Consultation",
      subtitle: "General medicine",
      footer: "Room A",
      start: new Date(2024, 0, 2, 9, 0, 0),
      end: new Date(2024, 0, 2, 10, 0, 0),
      color: "primary",
    };

    const wrapper = mountSchedule({ events: [event] });
    await nextTick();
    await nextTick();

    const eventButton = wrapper.get("button.e-schedule__event-container");
    await eventButton.trigger("click");

    expect(wrapper.emitted("click:event")).toHaveLength(1);
    expect(wrapper.emitted("click:event")?.[0]?.[0].data).toMatchObject({
      name: "Consultation",
      entityId: "room-a",
    });
  });

  it("renders default empty slots as buttons and emits click:empty-slot with the resolved space", async () => {
    const wrapper = mountSchedule();
    await nextTick();
    await nextTick();

    const emptySlotButton = wrapper.get("button.e-schedule__empty-slot");
    await emptySlotButton.trigger("click");

    expect(emptySlotButton.attributes("aria-label")).toContain("Create event for room-a");
    expect(wrapper.emitted("click:empty-slot")).toHaveLength(1);
    expect(wrapper.emitted("click:empty-slot")?.[0]?.[0].data).toMatchObject({
      entityId: "room-a",
      name: "",
      color: "primary",
    });
  });

  it("labels pagination controls when the schedule spans multiple pages", async () => {
    const wrapper = mountSchedule({
      mode: ScheduleMode.schedule,
      scheduleColumn: 1,
    });
    await nextTick();

    expect(wrapper.get('button[aria-label="Previous schedule page"]').attributes("title")).toBe("Previous schedule page");
    expect(wrapper.get('button[aria-label="Next schedule page"]').attributes("title")).toBe("Next schedule page");
  });
});