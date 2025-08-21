import React, { useState, useEffect } from "react";

const PGStatusScreen = () => {
  // Changed to named export
  const [isPgAppWrapperPresent, setIsPgAppWrapperPresent] = useState<
    boolean | null
  >(null);
  const [loadingStatus, setLoadingStatus] = useState<string>("Checking...");

  useEffect(() => {
    // Function to check for the div using Chrome API
    const checkDivPresence = async () => {
      setLoadingStatus("Checking for pg-app-wrapper div...");
      // Check if browser.tabs and browser.scripting APIs are available (i.e., running in a Chrome extension context)
      if (typeof browser !== "undefined" && browser.tabs && browser.scripting) {
        try {
          // Query for the active tab in the current window
          const [tab] = await browser.tabs.query({
            active: true,
            currentWindow: true,
          });

          if (tab && tab.id) {
            // Execute a script in the active tab to check for the div
            const results = await browser.scripting.executeScript({
              target: { tabId: tab.id },
              func: () => {
                return document.getElementById("pg-app-wrapper") !== null;
              },
            });

            // The result[0].result contains the boolean from the executed script
            if (
              results &&
              results[0] &&
              typeof results[0].result === "boolean"
            ) {
              setIsPgAppWrapperPresent(results[0].result);
              setLoadingStatus(results[0].result ? "Found!" : "Not found.");
            } else {
              setIsPgAppWrapperPresent(false);
              setLoadingStatus(
                "Could not determine status (script execution issue)."
              );
              console.error(
                "Failed to get result from script execution:",
                results
              );
            }
          } else {
            setIsPgAppWrapperPresent(false);
            setLoadingStatus("No active tab found.");
          }
        } catch (error) {
          setIsPgAppWrapperPresent(false);
          setLoadingStatus("Error checking div presence.");
          console.error("Error in Chrome scripting API:", error);
        }
      } else {
        // Fallback for development outside of a Chrome extension environment
        setIsPgAppWrapperPresent(false); // Assume not present or unable to check
        setLoadingStatus(
          "Chrome Extension API not available (run as an actual extension to check)."
        );
        console.warn(
          "Chrome Extension API (browser.tabs, browser.scripting) not available. This component needs to run within a Chrome Extension environment for full functionality."
        );
      }
    };

    checkDivPresence();
  }, []); // Run once on component mount

  const statusText = isPgAppWrapperPresent === true ? "Active" : "Inactive";
  const statusColorClass =
    isPgAppWrapperPresent === true
      ? "text-green-600 bg-green-50"
      : "text-red-600 bg-red-50";
  const statusIcon = isPgAppWrapperPresent === true ? "✅" : "❌";

  return (
    <div className="p-4 text-center">
      <h2 className="text-2xl font-extrabold mb-4 text-indigo-700">
        Service Status
      </h2>
      <div
        className={`text-lg p-3 rounded-md shadow-inner inline-block ${statusColorClass}`}
      >
        {statusIcon} Service is {statusText}
      </div>
      <p className="mt-4 text-sm text-gray-500">
        Current status of `pg-app-wrapper` div:{" "}
        <span className="font-semibold">{loadingStatus}</span>
      </p>
    </div>
  );
};

export default PGStatusScreen