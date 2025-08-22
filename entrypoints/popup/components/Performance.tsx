import React from "react";
import LoadingSpinner from "./LoadingSpinner";

interface PerformanceEntry {
  name: string;
  duration: number;
}

const trackedUrls = [
  "tag.js",
  "facet-chat.js",
  "/feed",
  "/generate_visitor_config",
];

const Performance = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceEntry[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const getPerformanceData = useCallback(() => {
    setLoading(true);
    browser.tabs.query({ active: true, currentWindow: true }, (tabs: any) => {
      if (!tabs || tabs.length === 0) {
        console.error("No active tab found.");
        setLoading(false);
        return;
      }

      const tabId = tabs[0].id;
      if (!tabId) {
        console.error("No tab ID found.");
        setLoading(false);
        return;
      }

      browser.scripting.executeScript(
        {
          target: { tabId: tabId },
          func: () => {
            return performance.getEntriesByType("resource").map((entry) => ({
              name: entry.name,
              duration: entry.duration,
            }));
          },
        },
        (results: any) => {
          if (browser.runtime.lastError) {
            console.error(
              "Script injection failed:",
              browser.runtime.lastError.message
            );
            setLoading(false);
            return;
          }

          if (results && results[0] && results[0].result) {
            // Filter the results to only include the URLs we care about.
            const filteredData = results[0].result.filter((entry: any) =>
              trackedUrls.some((url) => entry.name.includes(url))
            );
            setPerformanceData(filteredData);
          } else {
            setPerformanceData([]);
          }
          setLoading(false);
        }
      );
    });
  }, []);

  useEffect(() => {
    getPerformanceData();
  }, [getPerformanceData]);

  const renderData = () => {
    if (loading) {
      return <LoadingSpinner />;
    }

    if (performanceData.length === 0) {
      return (
        <div className="status-message">
          No tracked performance data found for this page.
        </div>
      );
    }

    return (
      <div className="performance-list">
        <div className="performance-list-header">
          <span className="performance-header-item">Resource</span>
          <span className="performance-header-item">Duration (ms)</span>
        </div>
        {performanceData.map((entry, index) => (
          <div key={index} className="performance-list-item">
            <span className="resource-name" title={entry.name}>{entry.name}</span>
            <span className="resource-duration">
              {entry.duration.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="performance-monitor-container">
      <div className="document-title">
        <h2>API & Script Timings</h2>
      </div>
      {renderData()}
      <button onClick={getPerformanceData} className="refresh-button">
        Refresh
      </button>
    </div>
  );
};

export default Performance;
