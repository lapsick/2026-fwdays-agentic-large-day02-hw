import { fireEvent, render } from "@testing-library/react";
import { vi } from "vitest";

import { reseed, setDateTimeForTests } from "@excalidraw/common";

import { Excalidraw } from "../..";
import { API } from "../../tests/helpers/api";
import { Pointer } from "../../tests/helpers/ui";
import {
    mockBoundingClientRect,
    render as renderApp,
    restoreOriginalGetBoundingClientRect,
} from "../../tests/test-utils";

import { ElementPropertiesPanel } from "./ElementPropertiesPanel";

import type { NonDeletedExcalidrawElement } from "@excalidraw/element/types";

const { h } = window;
const mouse = new Pointer("mouse");

vi.mock("../App", async (importOriginal) => {
  const original = await importOriginal<typeof import("../App")>();
  return {
    ...original,
    useExcalidrawAppState: () => ({ selectedElementIds: {} }),
  };
});

describe("ElementPropertiesPanel", () => {
  describe("standalone (no element selected)", () => {
    it("renders empty state when no elements are selected", () => {
      const onClose = vi.fn();
      const rect = API.createElement({ type: "rectangle", id: "rect1" });

      const { getByTestId } = render(
        <ElementPropertiesPanel elements={[rect]} onClose={onClose} />,
      );

      expect(getByTestId("properties-panel-empty")).toBeDefined();
    });

    it("renders the panel header", () => {
      const onClose = vi.fn();
      const { getByTestId } = render(
        <ElementPropertiesPanel elements={[]} onClose={onClose} />,
      );

      expect(getByTestId("properties-panel-close")).toBeDefined();
    });

    it("calls onClose when close button is clicked", () => {
      const onClose = vi.fn();
      const { getByTestId } = render(
        <ElementPropertiesPanel elements={[]} onClose={onClose} />,
      );

      fireEvent.click(getByTestId("properties-panel-close"));
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("integration: within Excalidraw context", () => {
    beforeAll(() => {
      mockBoundingClientRect();
    });

    afterAll(() => {
      restoreOriginalGetBoundingClientRect();
    });

    beforeEach(async () => {
      localStorage.clear();
      reseed(7);
      setDateTimeForTests("202601011200");
      await renderApp(<Excalidraw />);
      API.setElements([]);
    });

    it("shows element type badge for a single selected element", async () => {
      const rect = API.createElement({
        type: "rectangle",
        id: "panel-rect2",
        x: 50,
        y: 60,
        width: 150,
        height: 90,
        strokeColor: "#ff0000",
        backgroundColor: "transparent",
        opacity: 80,
      });

      API.setElements([rect]);
      API.updateScene({ appState: { selectedElementIds: { [rect.id]: true } } });

      await new Promise((r) => setTimeout(r, 10));

      const onClose = vi.fn();
      const panel = render(
        <ElementPropertiesPanel
          elements={h.elements as readonly NonDeletedExcalidrawElement[]}
          onClose={onClose}
        />,
        { container: document.body },
      );

      expect(panel.getByTestId("element-type-badge").textContent).toBe(
        "rectangle",
      );
    });

    it("shows multi-selection info when multiple elements are selected", async () => {
      const rect = API.createElement({
        type: "rectangle",
        id: "panel-rect3",
        x: 0,
        y: 0,
        width: 100,
        height: 80,
        opacity: 60,
      });
      const ellipse = API.createElement({
        type: "ellipse",
        id: "panel-ellipse1",
        x: 200,
        y: 0,
        width: 80,
        height: 80,
        opacity: 80,
      });

      API.setElements([rect, ellipse]);
      API.updateScene({
        appState: { selectedElementIds: { [rect.id]: true, [ellipse.id]: true } },
      });

      await new Promise((r) => setTimeout(r, 10));

      const onClose = vi.fn();
      const panel = render(
        <ElementPropertiesPanel
          elements={h.elements as readonly NonDeletedExcalidrawElement[]}
          onClose={onClose}
        />,
        { container: document.body },
      );

      expect(panel.getByTestId("multi-select-info")).toBeDefined();
    });
  });
});

