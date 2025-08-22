export const UseMountStatus = () => {
  const [loading, setLoading] = useState(true);
  const [pgEnabled, setIsPGEnabled] = useState<boolean | null>(null);
  const [lastChecked, setLastChecked] = useState("");

  const checkWrapperExistence = useCallback(async () => {
    try {
      setLoading(true);
      if (!browser || !browser.tabs || !browser.scripting) {
        throw new Error(
          "Browser Extension API not available (run as an actual extension to check)."
        );
      }

      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab || !tab.id) {
        throw new Error("No active tab found.");
      }

      const results = await browser.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          return document.getElementById("pg-app-wrapper") !== null;
        },
      });

      if (
        !results ||
        results.length <= 0 ||
        !(typeof results[0].result === "boolean")
      ) {
        throw new Error("Could not determine status (script execution issue).");
      }

      setIsPGEnabled(results[0].result);
    } catch (error) {
      console.error(error);
    } finally {
      setLastChecked(new Date().toLocaleTimeString());
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkWrapperExistence();
  }, []);

  return { loading, pgEnabled, lastChecked, checkWrapperExistence };
};
