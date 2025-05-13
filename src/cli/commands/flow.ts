import chalk from 'chalk';
import { loadConfig } from '../utils/loadConfig.js';
import { runCommand } from '../utils/runCommand.js';

export const flow = async (flowname?: string) => {
  try {
    const config = await loadConfig();
    const flows = config?.flows;

    if (!flows || !Array.isArray(flows)) {
      throw new Error("No flows found in config");
    }

    if (!flowname) {
      console.log("Available flows:");
      flows.forEach(f => {
        console.log(`- ${f.name}`);
      });
      return;
    }

    const flow = flows.find(f => f.name === flowname);

    if (!flow) {
      throw new Error(`Flow ${flowname} not found`);
    }

    console.log(`${chalk.blue(`> Flow ${flowname}`)}`);
    for (const step of flow.steps) {
      if (step.run) {
        await runCommand(step);
        console.log();
      }
    }

  } catch (e) {
    console.log(`${chalk.red("ERR:")} ${e}`);
  }
}
