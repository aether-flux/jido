import chalk from "chalk";
import { Flow } from "jido-kit/types";

export const flowLogger = (flows: Flow[]) => {
  console.log(`\n${chalk.blue("Available flows:")}`);

  flows.forEach((flow) => {
    const { name, description, steps } = flow;
    console.log(`${chalk.yellow(`-- ${name}:`)} ${description || "No description provided."}`);
  });
}
