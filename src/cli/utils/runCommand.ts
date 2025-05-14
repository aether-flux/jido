import chalk from "chalk";
import { spawn } from "child_process";

type HookFn = () => void | Promise<void>;

export const runCommand = (stepConf: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    const { run: cmd, onStart, onSuccess, onFailure, plugins } = stepConf;

    let hooks: {
      onStart: HookFn[];
      onSuccess: HookFn[];
      onFailure: HookFn[];
    } = {
      onStart: [],
      onSuccess: [],
      onFailure: [],
    };

    if (typeof onStart === "function") hooks.onStart.push(onStart);
    if (typeof onSuccess === "function") hooks.onSuccess.push(onSuccess);
    if (typeof onFailure === "function") hooks.onFailure.push(onFailure);

    if (plugins) {
      plugins.forEach((p: any) => {
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
      console.log(`${chalk.yellow(">")} ${chalk.yellow(cmd)}\n`);
      
      if (hooks.onStart) {
        hooks.onStart.forEach((fn: Function) => {
          fn();
          console.log();
        })
      }
    });

    child.on("close", (code) => {
      if (code === 0) {
        if (hooks.onSuccess) {
          hooks.onSuccess.forEach((fn: Function) => {
            console.log();
            fn();
          })
        }
        resolve();
      } else {
        console.log();

        if (hooks.onFailure) {
          hooks.onFailure.forEach((fn: Function) => {
            fn();
            console.log();
          })
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
