import { useEffect, useState } from "react";

const ElementPropertiesPanelAlt = ({ elements, onClose }: any) => {
  const [selected, setSelected] = useState<any[]>([]);

  useEffect(() => {
    if (!elements) return;
    setSelected(elements);
  }, [elements]);

  if (!selected || selected.length === 0) {
    return (
      <div className="element-properties-panel">
        <div className="element-properties-panel__header">
          <h2>Element Properties</h2>
          <button onClick={onClose}>✕</button>
        </div>
        <div>No elements selected</div>
      </div>
    );
  }

  const el = selected[0];

  return (
    <div className="element-properties-panel">
      <div className="element-properties-panel__header">
        <h2>Element Properties</h2>
        <button onClick={onClose}>✕</button>
      </div>

      {selected.length > 1 ? (
        <div>
          <p>{selected.length} elements selected</p>
          <p>Types: {[...new Set(selected.map((e: any) => e.type))].join(", ")}</p>
          <p>
            Avg opacity:{" "}
            {(selected.reduce((s: number, e: any) => s + e.opacity, 0) / selected.length).toFixed(2)}%
          </p>
        </div>
      ) : (
        <div>
          <p>Type: {el.type}</p>
          <p>X: {el.x?.toFixed(2)}</p>
          <p>Y: {el.y?.toFixed(2)}</p>
          <p>Width: {el.width?.toFixed(2)}</p>
          <p>Height: {el.height?.toFixed(2)}</p>
          <p>Angle: {((el.angle * 180) / Math.PI).toFixed(2)}°</p>
          <p>Stroke: {el.strokeColor}</p>
          <p>Background: {el.backgroundColor}</p>
          <p>Opacity: {el.opacity}%</p>
          {el.type === "text" && <p>Font size: {el.fontSize}</p>}
        </div>
      )}
    </div>
  );
};

export default ElementPropertiesPanelAlt;
