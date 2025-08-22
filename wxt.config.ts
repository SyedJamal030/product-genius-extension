import { defineConfig } from "wxt";
import path from "path";

// See https://wxt.dev/api/config.html
export default defineConfig({
  webExt: { disabled: true },
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "Product Genius QA Toolkit",
    description:
      "A quality assurance tool for the Product Genius team, for monitoring and testing of the plugin across Shopify stores.",
    permissions: ["activeTab", "storage", "scripting"],
  },
  vite: () => ({
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./"),
      },
    },
  }),
});
