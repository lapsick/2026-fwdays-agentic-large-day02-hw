import { round } from "@excalidraw/math";
import { memo } from "react";

import { isTransparent } from "@excalidraw/common";

import { isTextElement } from "@excalidraw/element";

import type { NonDeletedExcalidrawElement } from "@excalidraw/element/types";

import { t } from "../../i18n";
import { useExcalidrawAppState } from "../App";
import { Island } from "../Island";
import { CloseIcon } from "../icons";

import "./ElementPropertiesPanel.scss";

export type ElementPropertiesPanelProps = {
  elements: readonly NonDeletedExcalidrawElement[];
  onClose: () => void;
};

const fmt = (n: number) => round(n, 2);

const ColorRow = ({
  label,
  color,
}: {
  label: string;
  color: string;
}) => (
  <div className="element-properties-panel__row" data-testid="color-row">
    <span className="element-properties-panel__row--label">{label}</span>
    <span className="element-properties-panel__row--value">
      {!isTransparent(color) && (
        <span
          className="element-properties-panel__color-swatch"
          style={{ background: color }}
          data-testid="color-swatch"
        />
      )}
      {color}
    </span>
  </div>
);

const PropRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="element-properties-panel__row" data-testid="prop-row">
    <span className="element-properties-panel__row--label">{label}</span>
    <span className="element-properties-panel__row--value">{value}</span>
  </div>
);

const SectionTitle = ({ title }: { title: string }) => (
  <div className="element-properties-panel__section-title">{title}</div>
);

const SingleElementProperties = ({
  element,
}: {
  element: NonDeletedExcalidrawElement;
}) => {
  const angleDeg = fmt((element.angle * 180) / Math.PI);

  return (
    <>
      <div
        className="element-properties-panel__type-badge"
        data-testid="element-type-badge"
      >
        {element.type}
      </div>

      <div className="element-properties-panel__section">
        <SectionTitle title={t("stats.position")} />
        <PropRow label="X" value={fmt(element.x)} />
        <PropRow label="Y" value={fmt(element.y)} />
      </div>

      <hr className="element-properties-panel__divider" />

      <div className="element-properties-panel__section">
        <SectionTitle title={t("stats.dimensions")} />
        <PropRow label={t("stats.width")} value={fmt(element.width)} />
        <PropRow label={t("stats.height")} value={fmt(element.height)} />
        <PropRow label={t("stats.angle")} value={`${angleDeg}°`} />
      </div>

      <hr className="element-properties-panel__divider" />

      <div className="element-properties-panel__section">
        <SectionTitle title={t("stats.style")} />
        <ColorRow label={t("labels.stroke")} color={element.strokeColor} />
        <ColorRow
          label={t("labels.background")}
          color={element.backgroundColor}
        />
        <PropRow label={t("labels.opacity")} value={`${element.opacity}%`} />
        <PropRow label={t("labels.strokeWidth")} value={element.strokeWidth} />
        <PropRow label={t("labels.strokeStyle")} value={element.strokeStyle} />
        <PropRow label={t("labels.fill")} value={element.fillStyle} />
      </div>

      {isTextElement(element) && (
        <>
          <hr className="element-properties-panel__divider" />
          <div className="element-properties-panel__section">
            <SectionTitle title={t("stats.textProperties")} />
            <PropRow label={t("labels.fontSize")} value={element.fontSize} />
          </div>
        </>
      )}
    </>
  );
};

const MultiElementProperties = ({
  elements,
}: {
  elements: readonly NonDeletedExcalidrawElement[];
}) => {
  const types = [...new Set(elements.map((el) => el.type))];
  const avgOpacity = fmt(
    elements.reduce((sum, el) => sum + el.opacity, 0) / elements.length,
  );

  return (
    <>
      <div
        className="element-properties-panel__multi-info"
        data-testid="multi-select-info"
      >
        {t("stats.multiSelection", { count: elements.length })}
      </div>

      <hr className="element-properties-panel__divider" />

      <div className="element-properties-panel__section">
        <SectionTitle title={t("stats.elementTypes")} />
        <PropRow label={t("stats.selected")} value={elements.length} />
        <PropRow label={t("stats.elementTypes")} value={types.join(", ")} />
      </div>

      <hr className="element-properties-panel__divider" />

      <div className="element-properties-panel__section">
        <SectionTitle title={t("stats.style")} />
        <PropRow label={t("labels.opacity")} value={`${avgOpacity}%`} />
      </div>
    </>
  );
};

export const ElementPropertiesPanel = memo(
  ({ elements, onClose }: ElementPropertiesPanelProps) => {
    const appState = useExcalidrawAppState();

    const selectedElements = elements.filter(
      (el) => appState.selectedElementIds[el.id],
    );

    const singleElement =
      selectedElements.length === 1 ? selectedElements[0] : null;
    const multipleElements =
      selectedElements.length > 1 ? selectedElements : null;

    return (
      <Island padding={2} className="element-properties-panel">
        <div className="element-properties-panel__header">
          <h2>{t("stats.elementProperties")}</h2>
          <button
            className="element-properties-panel__close"
            onClick={onClose}
            aria-label={t("buttons.close")}
            data-testid="properties-panel-close"
          >
            {CloseIcon}
          </button>
        </div>

        {selectedElements.length === 0 && (
          <div
            className="element-properties-panel__empty"
            data-testid="properties-panel-empty"
          >
            {t("stats.noSelection")}
          </div>
        )}

        {singleElement && <SingleElementProperties element={singleElement} />}

        {multipleElements && (
          <MultiElementProperties elements={multipleElements} />
        )}
      </Island>
    );
  },
);

ElementPropertiesPanel.displayName = "ElementPropertiesPanel";
