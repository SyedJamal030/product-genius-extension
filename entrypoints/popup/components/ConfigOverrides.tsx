import React from "react";

import {
  initialOverrides,
  Overrides,
  OverrideItem,
  OverrideType,
} from "../util/overrides";
import "./component.css";

const ConfigOverrides: React.FC = () => {
  const [overrides, setOverrides] = useState<Overrides>(initialOverrides);
  const [tabId, setTabId] = useState<number | null>(null);

  const parseUrlParamValue = useCallback(
    (value: string, type: OverrideType): OverrideItem["value"] => {
      switch (type) {
        case "boolean":
          return value.toLowerCase() === "true";
        case "int":
          const intVal = parseInt(value, 10);
          return isNaN(intVal) ? 0 : intVal;
        case "float":
          const floatVal = parseFloat(value);
          return isNaN(floatVal) ? 0.0 : floatVal;
        case "string":
        default:
          return value;
      }
    },
    []
  );

  const handleOverrideChange = useCallback(
    (key: string, newPartialOverride: Partial<OverrideItem>) => {
      setOverrides((prevOverrides) => ({
        ...prevOverrides,
        [key]: {
          ...prevOverrides[key],
          ...newPartialOverride,
        },
      }));
    },
    []
  );

  const applyOverridesAndRefresh = useCallback(async () => {
    if (tabId === null) {
      console.warn("No active tab ID available to apply overrides.");
      return;
    }

    try {
      const tabs = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });
      const tab = tabs[0];
      if (!tab || !tab.url || !tab.id) return;

      const currentUrlObj = new URL(tab.url);
      const params = currentUrlObj.searchParams;

      Object.entries(overrides).forEach(([key, overrideProps]) => {
        if (overrideProps.enabled) {
          params.set(key, String(overrideProps.value));
        } else {
          params.delete(key);
        }
      });

      const newUrl = `${currentUrlObj.origin}${
        currentUrlObj.pathname
      }?${params.toString()}${currentUrlObj.hash}`;

      await browser.tabs.update(tab.id, { url: newUrl });
      await browser.storage.local.set({
        [`overrides-${tab.id}`]: overrides,
      });

      window.close();
    } catch (error) {
      console.error("Failed to apply overrides:", error);
    }
  }, [tabId, overrides]);

  useEffect(() => {
    const loadState = async () => {
      try {
        const tabs = await browser.tabs.query({
          active: true,
          currentWindow: true,
        });
        const tab = tabs[0];
        if (!tab || !tab.url || !tab.id) return;
        setTabId(tab.id);

        let mergedOverrides = { ...initialOverrides };

        const stored = await browser.storage.local.get(`overrides-${tab.id}`);
        if (stored[`overrides-${tab.id}`]) {
          mergedOverrides = {
            ...mergedOverrides,
            ...stored[`overrides-${tab.id}`],
          };
        }

        try {
          const url = new URL(tab.url);
          const params = url.searchParams;
          for (const key in mergedOverrides) {
            if (params.has(key)) {
              const paramValue = params.get(key);
              if (paramValue !== null) {
                mergedOverrides[key] = {
                  ...mergedOverrides[key],
                  value: parseUrlParamValue(
                    paramValue,
                    mergedOverrides[key].type
                  ),
                  enabled: true,
                };
              }
            }
          }
        } catch (urlError) {
          console.warn("Could not parse tab URL:", urlError);
        }

        setOverrides(mergedOverrides);
      } catch (error) {
        console.error("Error loading overrides:", error);
        setOverrides(initialOverrides);
      }
    };
    loadState();
  }, [parseUrlParamValue]);

  return (
    <div className="config-overrides-container">
      <div className="config-overrides-header">
        <h2>Config Overrides</h2>
        <button
          onClick={applyOverridesAndRefresh}
          className="apply-overrides-button"
          title="Refresh Page with Overrides"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width={18}
            height={18}
          >
            <path
              fillRule="evenodd"
              d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div className="override-list">
        {Object.entries(overrides).map(([key, overrideProps]) => (
          <OverrideItemComponent
            key={key}
            overrideKey={key}
            {...overrideProps}
            onChange={handleOverrideChange}
          />
        ))}
      </div>
    </div>
  );
};

export default ConfigOverrides;

interface OverrideItemProps {
  overrideKey: string;
  type: OverrideItem["type"];
  value: OverrideItem["value"];
  enabled: boolean;
  label: OverrideItem["label"];
  onChange: (key: string, newPartialOverride: Partial<OverrideItem>) => void;
}

const OverrideItemComponent: React.FC<OverrideItemProps> = ({
  overrideKey,
  type,
  value,
  enabled,
  label,
  onChange,
}) => {
  const handleToggle = () => {
    onChange(overrideKey, { enabled: !enabled });
  };

  const handleValueChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let newValue: string | boolean | number = e.target.value;

    if (type === "boolean") {
      newValue = e.target.value === "true";
    } else if (type === "int") {
      newValue = parseInt(e.target.value, 10);
      if (isNaN(newValue)) newValue = 0;
    } else if (type === "float") {
      newValue = parseFloat(e.target.value);
      if (isNaN(newValue)) newValue = 0.0;
    }

    onChange(overrideKey, { value: newValue });
  };

  const renderInput = () => {
    switch (type) {
      case "boolean":
        return (
          <select
            value={value ? "true" : "false"}
            onChange={handleValueChange}
            disabled={!enabled}
            className="override-select"
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        );
      case "int":
      case "float":
        return (
          <input
            type="number"
            step={type === "float" ? "0.1" : "1"}
            value={value as number}
            onChange={handleValueChange}
            disabled={!enabled}
            className="override-input-number"
          />
        );
      case "string":
        return (
          <input
            type="text"
            value={value as string}
            onChange={handleValueChange}
            disabled={!enabled}
            className="override-input-text"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="override-item">
      <div className="override-item-left">
        <input
          type="checkbox"
          id={overrideKey}
          checked={enabled}
          onChange={handleToggle}
          className="override-checkbox"
        />
        <label htmlFor={overrideKey} className="override-label">
          {label}
        </label>
      </div>
      <div className="override-input-wrapper">{renderInput()}</div>
    </div>
  );
};
