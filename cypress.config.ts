import { defineConfig } from "cypress";

export default defineConfig({
  projectId: 'ft2keg',
  viewportWidth: 1000,
  viewportHeight: 1200,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
