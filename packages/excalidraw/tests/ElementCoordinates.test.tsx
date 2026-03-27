import { render } from "@testing-library/react";

import { newElement } from "@excalidraw/element";

import { ElementCoordinates } from "../components/Stats/ElementCoordinates";

import type { ElementsMap } from "@excalidraw/element/types";

describe("ElementCoordinates", () => {
  it("should render top-left and bottom-right coordinates of a rectangle", () => {
    const element = newElement({ type: "rectangle", x: 10, y: 20, width: 100, height: 50 });
    const elementsMap = new Map([[element.id, element]]) as ElementsMap;

    const { getByTestId } = render(
      <ElementCoordinates element={element} elementsMap={elementsMap} />,
    );

    expect(getByTestId("element-coordinates")).toBeDefined();
    expect(getByTestId("coords-TL-x").textContent).toBe("10");
    expect(getByTestId("coords-TL-y").textContent).toBe("20");
    expect(getByTestId("coords-BR-x").textContent).toBe("110");
    expect(getByTestId("coords-BR-y").textContent).toBe("70");
  });

  it("should round coordinates to 2 decimal places", () => {
    const element = newElement({
      type: "rectangle",
      x: 10.123,
      y: 20.456,
      width: 100.789,
      height: 50.111,
    });
    const elementsMap = new Map([[element.id, element]]) as ElementsMap;

    const { getByTestId } = render(
      <ElementCoordinates element={element} elementsMap={elementsMap} />,
    );

    expect(getByTestId("coords-TL-x").textContent).toBe("10.12");
    expect(getByTestId("coords-TL-y").textContent).toBe("20.46");
  });

  it("should update displayed coordinates when element changes", () => {
    const element = newElement({ type: "rectangle", x: 0, y: 0, width: 50, height: 50 });
    const elementsMap = new Map([[element.id, element]]) as ElementsMap;

    const { getByTestId, rerender } = render(
      <ElementCoordinates element={element} elementsMap={elementsMap} />,
    );

    expect(getByTestId("coords-TL-x").textContent).toBe("0");

    const moved = { ...element, x: 30, y: 40 };
    rerender(
      <ElementCoordinates element={moved} elementsMap={elementsMap} />,
    );

    expect(getByTestId("coords-TL-x").textContent).toBe("30");
    expect(getByTestId("coords-TL-y").textContent).toBe("40");
  });
});
