import chalk from "chalk";
import { spawn } from "child_process";

export const runCommand = (stepConf: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    const { run: cmd, onStart, onSuccess, onFailure } = stepConf;

    const child = spawn(cmd, {
      stdio: "inherit",
      shell: true,
    });

    child.on("spawn", () => {
      console.log(`${chalk.yellow(">")} ${chalk.yellow(cmd)}\n`);
      
      if (onStart) {
        onStart();
        console.log();
      }
    });

    child.on("close", (code) => {
      if (code === 0) {
        if (onSuccess) {
          console.log();
          onSuccess();
        }
        resolve();
      } else {
        console.log();

        if (onFailure) {
          onFailure();
          console.log();
        }

        reject(new Error(`Command "${cmd}" failed with exit code ${code}`));
      }
    });

    child.on('error', (err) => {
      console.error(`> ${cmd} --- Failed to start process`);
      reject(err);
    });
  });
}
