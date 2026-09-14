import { describe, expect, it } from "vitest";
import { chooseDirection, planLargestSplit } from "../src/layout.js";
import type { PaneLayout } from "../src/types.js";

const minimum = { width: 72, height: 20 };

function layout(panes: PaneLayout["panes"]): PaneLayout {
  return {
    workspace_id: "w1",
    tab_id: "t1",
    zoomed: false,
    focused_pane_id: panes[0]?.pane_id ?? "",
    area: { x: 0, y: 0, width: 200, height: 50 },
    panes,
    splits: [],
  };
}

describe("adaptive pane planning", () => {
  it("splits a wide pane to the right", () => {
    expect(chooseDirection({ x: 0, y: 0, width: 192, height: 46 }, minimum)).toBe("right");
  });

  it("splits down when width would violate the minimum", () => {
    expect(chooseDirection({ x: 0, y: 0, width: 143, height: 46 }, minimum)).toBe("down");
  });

  it("refuses a split that would make either pane too small", () => {
    expect(chooseDirection({ x: 0, y: 0, width: 120, height: 35 }, minimum)).toBeUndefined();
  });

  it("chooses the largest eligible pane in an agents tab", () => {
    const current = layout([
      { pane_id: "small", focused: false, rect: { x: 0, y: 0, width: 100, height: 20 } },
      { pane_id: "large", focused: true, rect: { x: 0, y: 20, width: 192, height: 46 } },
    ]);
    expect(planLargestSplit(current, new Set(["small", "large"]), minimum)).toEqual({
      sourcePaneId: "large",
      direction: "right",
    });
  });
});
