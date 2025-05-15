import chalk from "chalk";
import { spawn } from "child_process";
import { Hook, Plugin, Step } from "jido-kit/types";

export const runCommand = (stepConf: Step): Promise<void> => {
  return new Promise((resolve, reject) => {
    const { run: cmd, onStart, onSuccess, onFailure, plugins } = stepConf;

    let duration: number;
    let hooks: Record<"onStart" | "onSuccess" | "onFailure", Hook[]> = {
      onStart: [],
      onSuccess: [],
      onFailure: [],
    };

    if (typeof onStart === "function") hooks.onStart.push(onStart);
    if (typeof onSuccess === "function") hooks.onSuccess.push(onSuccess);
    if (typeof onFailure === "function") hooks.onFailure.push(onFailure);

    if (plugins) {
      plugins.forEach((p: Plugin) => {
        if (typeof p.onStart === "function") hooks.onStart.push(p.onStart);

        if (typeof p.onSuccess === "function") hooks.onSuccess.push(p.onSuccess);

        if (typeof p.onFailure === "function") hooks.onFailure.push(p.onFailure);
      })
    }

    const child = spawn(cmd, {
      stdio: "inherit",
      shell: true,
    });

    child.on("spawn", () => {
      duration = Date.now();
      console.log(`${chalk.yellow(">")} ${chalk.yellow(cmd)}\n`);
      
      //if (hooks.onStart) {
      hooks.onStart.forEach((fn: Hook) => {
        fn();
        console.log();
      })
      //}
    });

    child.on("close", (code) => {
      duration = Date.now() - duration;

      if (code === 0) {
        hooks.onSuccess.forEach((fn: Hook) => {
          console.log();
          fn();
        });

        console.log(`\n${chalk.green(`✔ [${duration} ms]`)}`);
        resolve();
      } else {
        console.log();

        hooks.onFailure.forEach((fn: Hook) => {
          fn();
          console.log();
        })

        console.log(`\n${chalk.red(`✖ [${duration} ms]`)}`);
        reject(new Error(`Command "${cmd}" failed with exit code ${code}`));
      }
    });

    child.on('error', (err) => {
      console.error(`> ${cmd} --- Failed to start process`);
      reject(err);
    });
  });
}
