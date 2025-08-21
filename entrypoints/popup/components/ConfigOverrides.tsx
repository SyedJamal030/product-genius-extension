import React from "react";
import { Override } from "../util/overrides";

interface ConfigOverridesProps {
  overrides: Override;
  onOverrideChange: (
    key: string,
    newPartialOverride: Partial<{ value: any; enabled: boolean }>
  ) => void;
  onRefresh: () => void;
}

const ConfigOverrides = ({
  overrides,
  onOverrideChange,
  onRefresh,
}: ConfigOverridesProps) => {
  return (
    <div>
      <h2>Config Overrides</h2>
      <div>
        {Object.entries(overrides).map(([key, overrideProps]) => (
          <OverrideItem
            key={key}
            {...overrideProps}
            overrideKey={key}
            onChange={onOverrideChange}
          />
        ))}
      </div>
      <button onClick={onRefresh}>🚀 Refresh Page with Overrides</button>
    </div>
  );
};

export default ConfigOverrides;

interface OverrideItemProps {
  overrideKey: string;
  type: "boolean" | "int" | "float" | "string";
  value: any;
  enabled: boolean;
  onChange: (
    key: string,
    newPartialOverride: Partial<{ value: any; enabled: boolean }>
  ) => void;
}

export const OverrideItem = ({
  overrideKey,
  type,
  value,
  enabled,
  onChange,
}: OverrideItemProps) => {
  const handleToggle = () => {
    onChange(overrideKey, { enabled: !enabled });
  };

  const handleValueChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let newValue = e.target.value;
    let parsedValue: any = newValue;

    switch (type) {
      case "int":
        parsedValue = parseInt(newValue, 10);
        if (isNaN(parsedValue)) parsedValue = 0;
        break;
      case "float":
        parsedValue = parseFloat(newValue);
        if (isNaN(parsedValue)) parsedValue = 0.0;
        break;
      case "boolean":
        parsedValue = newValue === "true";
        break;
      default:
        break;
    }
    onChange(overrideKey, { value: parsedValue });
  };

  const displayLabel = overrideKey
    .split(".")
    .pop()
    ?.replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div>
      <input type="checkbox" checked={enabled} onChange={handleToggle} />
      <label>{displayLabel}</label>

      {type === "boolean" && (
        <select
          value={value ? "true" : "false"}
          onChange={handleValueChange}
          disabled={!enabled}
        >
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      )}
      {(type === "int" || type === "float" || type === "string") && (
        <input
          type={type === "int" || type === "float" ? "number" : "text"}
          step={type === "float" ? "0.1" : "1"}
          value={value}
          onChange={handleValueChange}
          disabled={!enabled}
          placeholder={`Enter ${type} value`}
        />
      )}
    </div>
  );
};
