import chalk from 'chalk';
import { loadConfig } from '../utils/loadConfig.js';
import { runCommand } from '../utils/runCommand.js';
import { flowLogger } from '../utils/flowLogger.js';

export const flow = async (flowname?: string, dryRun?: boolean) => {
  try {
    const config = await loadConfig();
    const flows = config?.flows;

    if (!flows || !Array.isArray(flows)) {
      throw new Error("No flows found in config file.");
    }

    if (!flowname) {
      flowLogger(flows);
      return;
    }

    const flow = flows.find(f => f.name === flowname);

    if (!flow) {
      throw new Error(`Flow ${flowname} not found`);
    }

    console.log(`${chalk.blue(`> Flow ${flowname}`)}`);
    for (const step of flow.steps) {
      if (step.run) {
        if (dryRun) {
          console.log(`${chalk.yellow(`> ${step.run}`)}`);
          continue;
        }
        await runCommand(step);
        console.log();
      }
    }

  } catch (e) {
    console.log(`\n${chalk.red("ERR:")} ${e}`);
  }
}
