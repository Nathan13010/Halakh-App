import { defineConfig } from "playwright/test";

const browserChannel = process.env.CI ? {} : { channel: "msedge" };

export default defineConfig({
  testDir: "./tests/learning-ui",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 30_000,
  reporter: "line",
  outputDir: "test-results/learning-ui",
  use: {
    baseURL: "http://127.0.0.1:5175",
    ...browserChannel,
    screenshot: "only-on-failure",
    trace: "retain-on-failure"
  },
  projects: [
    {
      name: "desktop",
      use: { viewport: { width: 1280, height: 800 } }
    },
    {
      name: "mobile-touch",
      use: {
        viewport: { width: 375, height: 812 },
        hasTouch: true,
        isMobile: true
      }
    }
  ],
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 5175",
    url: "http://127.0.0.1:5175",
    reuseExistingServer: true,
    timeout: 30_000
  }
});
