import { Fragment, useState } from "react";

import {
  ConfigIcon,
  OverrideIcon,
  ParseIcon,
  StatusIcon,
  TimeIcon,
} from "./components/Icons";
import NavItem from "./components/NavItem";
import ConfigOverrides from "./components/ConfigOverrides";
import PGStatusScreen from "./components/PGStatus";

import { initialOverrides, Override } from "./util/overrides";

import PGLogo from "/pg-logo.png";
import "./App.css";

const SESSION_STORAGE_KEY = "lastSelectedPGTab";
function App() {
  const [overrides, setOverrides] = useState(initialOverrides);
  const [tabId, setTabId] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState(() => {
    return sessionStorage.getItem(SESSION_STORAGE_KEY) || "status";
  });

  const parseUrlParamValue = (
    value: string,
    type: "boolean" | "int" | "float" | "string"
  ): boolean | number | string => {
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
  };

  useEffect(() => {
    sessionStorage.setItem(SESSION_STORAGE_KEY, selectedTab);
  }, [selectedTab]);

  const handleTabClick = useCallback((tabName: string) => {
    setSelectedTab(tabName);
  }, []);

  const handleOverrideChange = useCallback(
    (key: string, value: Partial<{ value: any; enabled: boolean }>) => {
      setOverrides((prevOverrides) => ({
        ...prevOverrides,
        [key]: {
          ...prevOverrides[key],
          ...value,
        },
      }));
    },
    []
  );

  const applyOverridesAndRefresh = useCallback(() => {
    if (tabId === null) {
      console.warn("No active tab ID available to apply overrides.");
      // In a real extension, you might show a user-friendly message
      return;
    }

    // Get the current tab's actual URL to modify it
    if (typeof browser !== "undefined" && browser.tabs) {
      browser.tabs.get(tabId, (tab) => {
        if (browser.runtime.lastError) {
          console.error(
            "Error getting tab:",
            browser.runtime.lastError.message
          );
          return;
        }
        if (!tab || !tab.url) {
          console.warn("Could not retrieve current tab URL.");
          return;
        }

        try {
          const currentUrlObj = new URL(tab.url);
          const params = currentUrlObj.searchParams;

          // Update URL parameters based on current overrides state
          Object.entries(overrides).forEach(
            ([key, { value, enabled, type }]) => {
              if (enabled) {
                let formattedValue = value;
                if (type === "boolean") {
                  formattedValue = value ? "true" : "false"; // Booleans sent as strings
                }
                params.set(key, formattedValue.toString()); // Ensure value is string for URL
              } else {
                params.delete(key); // Remove if disabled
              }
            }
          );

          const newUrl = `${currentUrlObj.origin}${
            currentUrlObj.pathname
          }?${params.toString()}${currentUrlObj.hash}`;
          console.log("Applying overrides and refreshing with URL:", newUrl);

          // Update the tab's URL
          browser.tabs.update(
            tabId,
            { url: newUrl, active: true },
            (updatedTab) => {
              if (browser.runtime.lastError) {
                console.error(
                  "Error updating tab:",
                  browser.runtime.lastError.message
                );
              } else if (!updatedTab) {
                console.warn("Tab not found after update request.");
              } else {
                console.log(`Tab ${tabId} updated successfully.`);
                if (browser.storage) {
                  browser.storage.local
                    .set({ [`${tabId.toString()}-overrides`]: overrides })
                    .catch((error) =>
                      console.error(
                        "Error saving overrides to Chrome storage:",
                        error
                      )
                    );
                }
                window.close();
              }
            }
          );
        } catch (urlParseError) {
          console.error(
            "Failed to parse current tab URL for modification:",
            urlParseError
          );
        }
      });
    } else {
      console.warn(
        "Chrome API not available. This function works in a real Chrome extension."
      );
    }
  }, [tabId, overrides]);

  useEffect(() => {
    const loadOverridesForActiveTab = async () => {
      if (typeof browser !== "undefined" && browser.tabs && browser.storage) {
        try {
          const [tab] = await browser.tabs.query({
            active: true,
            currentWindow: true,
          });
          if (tab && tab.id && tab.url) {
            setTabId(tab.id);
            // Attempt to retrieve overrides specific to this tab from local storage
            const STORAGE_KEY = `${tab.id.toString()}-overrides`;

            // 1. Start with default overrides
            let currentTabOverrides: Override = { ...initialOverrides };

            // 2. Load overrides from chrome.storage.local for this tab
            const storedResult = await browser.storage.local.get(STORAGE_KEY);
            if (storedResult[STORAGE_KEY]) {
              currentTabOverrides = {
                ...currentTabOverrides, // Merge with defaults
                ...storedResult[STORAGE_KEY], // Overwrite with stored values
              };
            }

            // 3. Parse URL parameters and override if present (URL takes precedence)
            try {
              const url = new URL(tab.url);
              const params = url.searchParams;

              for (const key in currentTabOverrides) {
                if (params.has(key)) {
                  const paramValue = params.get(key);
                  if (paramValue !== null) {
                    currentTabOverrides = {
                      ...currentTabOverrides,
                      [key]: {
                        ...currentTabOverrides[key],
                        value: parseUrlParamValue(
                          paramValue,
                          currentTabOverrides[key].type
                        ),
                        enabled: true,
                      },
                    };
                  }
                }
              }
            } catch (urlError) {
              console.warn(
                "Could not parse tab URL for overrides (might be a special chrome:// or about: URL):",
                urlError
              );
            }

            setOverrides(currentTabOverrides);
          } else {
            setTabId(null);
            setOverrides(initialOverrides); // No active tab, revert to default
          }
        } catch (error) {
          console.error("Error loading overrides from Chrome storage:", error);
          setOverrides(initialOverrides); // Fallback to default on error
        }
      } else {
        // Fallback for development outside of a Chrome extension environment
        console.warn(
          "Chrome Extension API not available. Running with default overrides."
        );
        setOverrides(initialOverrides);
      }
    };

    loadOverridesForActiveTab();

    // Listener for when the active tab changes to load new settings
    // This is crucial for tab-specific persistence within the same browser window
    const handleTabActivated = () => {
      // When a tab is activated, we need to reload its specific overrides.
      // We delay this slightly to ensure chrome.tabs.query returns the *new* active tab.
      setTimeout(loadOverridesForActiveTab, 100);
    };
    // Add the listener if in a Chrome extension environment
    if (typeof browser !== "undefined" && browser.tabs) {
      browser.tabs.onActivated.addListener(handleTabActivated);
    }

    // Cleanup function for the effect
    return () => {
      if (typeof browser !== "undefined" && browser.tabs) {
        browser.tabs.onActivated.removeListener(handleTabActivated);
      }
    };
  }, []);

  const renderContent = () => {
    switch (selectedTab) {
      case "status":
        return <PGStatusScreen />;
      case "config":
        return (
          <ConfigOverrides
            overrides={overrides}
            onOverrideChange={handleOverrideChange}
            onRefresh={applyOverridesAndRefresh}
          />
        );
      default:
        return null;
    }
  };
  return (
    <Fragment>
      <header className="header bar bar--top" tabIndex={1}>
        <div className="header-logo-wrapper">
          <img
            alt="Company Logo"
            className="pg-logo"
            src={PGLogo}
            width={32}
            height={32}
          />
          <h1 className="company_name">Product Genius</h1>
        </div>
      </header>
      <main className="main main-content">{renderContent()}</main>
      <footer className="footer bar bar--bottom">
        <menu className="footer-navigation">
          <NavItem
            icon={<StatusIcon />}
            label="Status"
            tab="status"
            selectedTab={selectedTab}
            onClick={handleTabClick}
          />
          <NavItem
            icon={<ParseIcon />}
            label="Parsing"
            tab="parse"
            selectedTab={selectedTab}
            onClick={handleTabClick}
          />
          <NavItem
            icon={<TimeIcon />}
            label="Timing"
            tab="timing"
            selectedTab={selectedTab}
            onClick={handleTabClick}
          />
          <NavItem
            icon={<OverrideIcon />}
            label="Override"
            tab="override"
            selectedTab={selectedTab}
            onClick={handleTabClick}
          />
          <NavItem
            icon={<ConfigIcon />}
            label="Config"
            tab="config"
            selectedTab={selectedTab}
            onClick={handleTabClick}
          />
        </menu>
      </footer>
    </Fragment>
  );
}

export default App;
