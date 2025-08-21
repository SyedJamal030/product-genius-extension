import { Fragment, useState } from "react";
import { ConfigIcon, OverrideIcon, ParseIcon, StatusIcon, TimeIcon } from "./components/Icons";
import NavItem from "./components/NavItem";

import PGLogo from "/pg-logo.png";
import "./App.css";

const SESSION_STORAGE_KEY = "lastSelectedPGTab";
function App() {
  const [selectedTab, setSelectedTab] = useState(() => {
    return sessionStorage.getItem(SESSION_STORAGE_KEY) || "status";
  });

  useEffect(() => {
    sessionStorage.setItem(SESSION_STORAGE_KEY, selectedTab);
  }, [selectedTab]);

  const handleTabClick = useCallback((tabName: string) => {
    setSelectedTab(tabName);
  }, []);

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
      <main className="main main-content"></main>
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
