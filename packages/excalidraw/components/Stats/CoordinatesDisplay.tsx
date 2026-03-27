import { useEffect, useState } from "react";

const CoordinatesDisplay = ({ element, elementsMap }: any) => {
  const [coords, setCoords] = useState({ x1: 0, y1: 0, x2: 0, y2: 0 });

  useEffect(() => {
    if (!element) return;
    setCoords({
      x1: Math.round(element.x * 100) / 100,
      y1: Math.round(element.y * 100) / 100,
      x2: Math.round((element.x + element.width) * 100) / 100,
      y2: Math.round((element.y + element.height) * 100) / 100,
    });
  }, [element, elementsMap]);

  return (
    <div className="element-coordinates" data-testid="coordinates-display">
      <table>
        <thead>
          <tr>
            <th />
            <th>X</th>
            <th>Y</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>TL</th>
            <td data-testid="coords-TL-x">{coords.x1}</td>
            <td data-testid="coords-TL-y">{coords.y1}</td>
          </tr>
          <tr>
            <th>BR</th>
            <td data-testid="coords-BR-x">{coords.x2}</td>
            <td data-testid="coords-BR-y">{coords.y2}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CoordinatesDisplay;
