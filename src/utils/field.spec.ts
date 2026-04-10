import { afterEach, describe, expect, it } from "vitest";

import { getNextTabbable, getPrevTabbable, getTabbables } from "./field";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("field utils", () => {
  it("returns visible tabbables in document order", () => {
    document.body.innerHTML = `
      <button id="before">Before</button>
      <button id="disabled" disabled>Disabled</button>
      <div hidden>
        <button id="hidden">Hidden</button>
      </div>
      <input id="input" />
      <div id="custom" tabindex="0"></div>
      <div id="skipped" tabindex="-1"></div>
    `;

    expect(getTabbables(document).map((element) => element.id)).toEqual([
      "before",
      "input",
      "custom",
    ]);
  });

  it("finds the next and previous tabbable outside the field subtree", () => {
    document.body.innerHTML = `
      <button id="before">Before</button>
      <div id="field">
        <button id="clear">Clear</button>
        <input id="input" />
      </div>
      <button id="after">After</button>
    `;

    const field = document.getElementById("field");

    expect(getPrevTabbable(field as HTMLElement)?.id).toBe("before");
    expect(getNextTabbable(field as HTMLElement)?.id).toBe("after");
  });
});