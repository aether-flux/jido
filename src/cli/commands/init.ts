import chalk from "chalk";
import path from "path";
import fs from "fs";

const defaultConfig = `import { jido } from "jido";

/*
* Define your workflows here.
* Each flow is a series of steps with commands to run and optional hooks (onStart, onSuccess, etc) to execute.
*/

const config = {
  flows: [
    {
      name: "run",
      description: "Run the project",
      steps: [
        {
          run: "npm install",
          onStart: () => console.log("Installing dependencies..."),
          onSuccess: () => console.log("Dependencies installed!")
        },
        {
          run: "npm run dev",
          onStart: () => console.log("Starting dev server...")
        }
      ]
    }
  ]
}

export default jido(config);
`

export const init = (force: boolean) => {
  try {
  const configPath = path.resolve(process.cwd(), "jido.config.js");

  if (fs.existsSync(configPath) && !force) {
    throw new Error("Config file already exists at root.");
  }

  fs.writeFileSync(configPath, defaultConfig);
  console.log(`\n${chalk.green("✔ Config file created successfully.")}`);
  } catch (e) {
    console.log(`\n${chalk.red("ERR:")} ${e}`);
  }
}
