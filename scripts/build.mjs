import { spawn } from "child_process";

process.env.NEXT_PRIVATE_BUILD_WORKER ??= "0";

const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "build"], {
  env: process.env,
  stdio: "inherit",
  windowsHide: true,
});

child.on("exit", (code) => {
  process.exit(code ?? 1);
});
