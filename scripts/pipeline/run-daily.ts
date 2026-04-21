import { spawn } from "node:child_process";

const steps = ["ingest", "normalize", "analyze", "propose", "publish", "audit"];

function run(command: string) {
  return new Promise<void>((resolve, reject) => {
    const executable = process.platform === "win32" ? "npm.cmd" : "npm";
    const child = spawn(`${executable} run pipeline:${command}`, {
      stdio: "inherit",
      shell: true,
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`pipeline:${command} failed with exit code ${code}`));
    });
  });
}

async function main() {
  console.log("\n== Running daily AI intelligence pipeline ==\n");

  for (const step of steps) {
    await run(step);
  }

  console.log("\nPipeline complete.\n");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
