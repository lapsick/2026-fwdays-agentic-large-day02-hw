import { round } from "@excalidraw/math";

import { getElementAbsoluteCoords } from "@excalidraw/element";

import type { ElementsMap, ExcalidrawElement } from "@excalidraw/element/types";

import type { GlobalPoint } from "@excalidraw/math";

type ElementCoordinatesProps = {
  element: ExcalidrawElement;
  elementsMap: ElementsMap;
};

type CoordRowProps = {
  label: string;
  point: GlobalPoint;
};

const CoordRow = ({ label, point }: CoordRowProps) => (
  <tr>
    <th>{label}</th>
    <td data-testid={`coords-${label}-x`}>{round(point[0], 2)}</td>
    <td data-testid={`coords-${label}-y`}>{round(point[1], 2)}</td>
  </tr>
);

export const ElementCoordinates = ({
  element,
  elementsMap,
}: ElementCoordinatesProps) => {
  const [x1, y1, x2, y2] = getElementAbsoluteCoords(element, elementsMap);

  return (
    <div className="element-coordinates" data-testid="element-coordinates">
      <table>
        <thead>
          <tr>
            <th />
            <th>X</th>
            <th>Y</th>
          </tr>
        </thead>
        <tbody>
          <CoordRow label="TL" point={[x1, y1] as GlobalPoint} />
          <CoordRow label="BR" point={[x2, y2] as GlobalPoint} />
        </tbody>
      </table>
    </div>
  );
};
