import chalk from "chalk";
import { loadConfig } from "../utils/loadConfig.js";
import { flowLogger } from "../utils/flowLogger.js";

export const list = async () => {
  try {
    const config = await loadConfig();
    const flows = config?.flows;

    if (!flows || !Array.isArray(flows)) {
      throw new Error("No flows found in config file.");
    }

    flowLogger(flows);

  } catch (e) {
    console.log(`${chalk.red("ERR:")} ${e}`)
  }
}
