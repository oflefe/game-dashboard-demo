import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true, // Use global APIs like `describe` and `it` without imports
    environment: "node", // Simulates a Node.js environment
  },
});
