import { defineConfig } from "@playwright/test";
import { existsSync } from "fs";

const port = Number(process.env.PLAYWRIGHT_PORT ?? 4182);
const localChromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const executablePath =
  process.env.PLAYWRIGHT_CHROME_EXECUTABLE_PATH ??
  (existsSync(localChromePath) ? localChromePath : undefined);

const webServer = process.env.PLAYWRIGHT_SKIP_WEBSERVER
  ? undefined
  : {
      command: `node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port ${port}`,
      reuseExistingServer: false,
      timeout: 60_000,
      url: `http://127.0.0.1:${port}`,
    };

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    permissions: ["clipboard-read", "clipboard-write"],
    launchOptions: executablePath ? { executablePath } : undefined,
  },
  webServer,
});
