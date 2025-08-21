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

import { initialOverrides } from "./util/overrides";

import PGLogo from "/pg-logo.png";
import "./App.css";

const SESSION_STORAGE_KEY = "lastSelectedPGTab";
function App() {
  const [currentUrl, setCurrentUrl] = useState<URL | null>(null);
  const [tabId, setTabId] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState(() => {
    return sessionStorage.getItem(SESSION_STORAGE_KEY) || "status";
  });
  const [overrides, setOverrides] = useState(initialOverrides);
  const currentUrlSearchParamsRef = useRef(new URLSearchParams());

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

  useEffect(() => {
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log(tabs[0]);      
      if (tabs[0] && tabs[0].id && tabs[0].url) {
        const url = new URL(tabs[0].url);
        setCurrentUrl(url);
        setTabId(tabs[0].id);
      }
    });
  }, []);

  const applyOverridesAndRefresh = useCallback(async () => {
    if (!currentUrl || tabId === null) {
      console.warn(
        "Current URL or Tab ID not available. Cannot apply changes."
      );

      if (typeof browser !== "undefined" && browser.notifications) {
        browser.notifications
          .create({
            type: "basic",
            iconUrl: "images/icon48.png",
            title: "PG Override",
            message: "Cannot apply changes: current URL or tab not found.",
            priority: 2,
          })
          .catch((err) => console.error("Error creating notification:", err));
      } else {
        console.error(
          "Cannot apply changes: current URL or tab not found. Notification API not available."
        );
      }
      return;
    }

    const newUrl = new URL(currentUrl.toString());
    const params = new URLSearchParams(newUrl.search);

    Object.entries(overrides).forEach(([key, { value, enabled, type }]) => {
      if (enabled) {
        let formattedValue = value;
        if (type === "boolean") {
          formattedValue = value ? "true" : "false";
        }
        params.set(key, formattedValue);
      } else {
        params.delete(key);
      }
    });

    const finalURL = `${currentUrl.origin}${
      currentUrl.pathname
    }?${params.toString()}`;

    if (tabId !== null && typeof browser !== "undefined" && browser.tabs) {
      try {
        await browser.tabs.update(tabId, { url: finalURL });
        window.close();
      } catch (error) {
        console.error("Error updating tab:", error);
        if (browser.notifications) {
          browser.notifications.create({
            type: "basic",
            iconUrl: "images/icon48.png",
            title: "PG Override Error",
            message: `Failed to update tab: ${(error as Error).message}`,
            priority: 2,
          });
        }
      }
    }
  }, [tabId, currentUrl]);

  const renderContent = () => {
    switch (selectedTab) {
      // case "status":
      //   return <StatusScreen />;
      // case "module1":
      // case "module2":
      // case "module3":
      //   return <UnderDevelopmentScreen />;
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
