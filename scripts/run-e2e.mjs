import { spawn } from "child_process";

const port = Number(process.env.PLAYWRIGHT_PORT ?? 4182);
const baseURL = `http://127.0.0.1:${port}`;
const nextBin = "node_modules/next/dist/bin/next";
const playwrightBin = "node_modules/@playwright/test/cli.js";

const server = spawn(
  process.execPath,
  [nextBin, "start", "--hostname", "127.0.0.1", "--port", String(port)],
  {
    env: process.env,
    stdio: ["ignore", "inherit", "inherit"],
    windowsHide: true,
  },
);

let exitCode = 1;

try {
  await waitForServer(baseURL);

  exitCode = await runCommand(process.execPath, [playwrightBin, "test"], {
    ...process.env,
    PLAYWRIGHT_SKIP_WEBSERVER: "1",
    PLAYWRIGHT_PORT: String(port),
  });
} catch (error) {
  console.error(error);
  exitCode = 1;
} finally {
  server.kill();
  process.exit(exitCode);
}

async function waitForServer(url) {
  const deadline = Date.now() + 60_000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // Retry until the server is ready.
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for ${url}`);
}

function runCommand(command, args, env) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      env,
      stdio: "inherit",
      windowsHide: true,
    });

    child.on("exit", (code) => resolve(code ?? 1));
  });
}
