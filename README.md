# Jido
**Automate your workflows in a flash**

---

## What is Jido?
[**Jido**](https://npmjs.com/package/jido) is a CLI tool for running named workflows, called *flows*, automating sequences of tasks and improving the developer experience without needing to memorize a bunch of commands or wiring up Makefiles.

Define your flows in a config file `jido.config.js` in the root directory of your project, and run a specific flow with:
```bash
jido flow <flowname>
```
**It's like `npm run` but cooler.**

## Installation
You can install `jido` globally or locally.
#### Global (Recommended)
```bash
npm install -g jido
```
#### (OR) Local (Per Project)
```bash
npm install --save-dev jido
```

Then, you're good to go!

## Getting Started
Run this to initialize a config:
```bash
jido init
```
It creates a basic `jido.config.js` in your project root.
<details>

<summary>Content of generated `jido.config.js`:</summary>

```js
import { jido } from "jido";

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
```
</details>

## Commands
### `jido flow [flowname]`
Runs the named flow as defined in your config:
```bash
jido flow build
```
#### Options:
- `-d`, `--dry-run`: Preview what the flow would do without actually executing it.
```bash
jido flow build --dry-run
```

### `jido list`
Lists all available flows defined in `jido.config.js`:
```bash
jido list
```

### `jido init`
Scaffolds a basic `jido.config.js` in your project root:
```bash
jido init
```
#### Options:
- `-f`, `--force`: Overwrite existing `jido.config.js` files, if any.
```bash
jido init --force
```

## Config Format
The `jido()` function takes an object (the config) as argument, which should be defined as follows:
```js
export default jido({
    flows: [
        {
            name: string,  // Name of the flow
            description?: string,  // Description, what the flow does
            steps: [
                {
                    run: string,  // Command to be run, eg. 'npm run dev'
                    // Optional hooks
                    onStart?: Hook,
                    onSuccess?: Hook,
                    onFailure?: Hook,
                    // Plugins
                    plugins: [
                        {
                            // Optional hooks received through plugins
                            onStart?: Hook,
                            onSuccess?: Hook,
                            onFailure?: Hook,
                        }
                    ],
                }
            ]
        }
    ]
});
```

Commands are run **sequentially**. If any command fails, the flow stops immediately.

## Writing a Plugin
Jido supports lightweight plugins at the step level, allowing you to inject custom behavior during `onStart`, `onSuccess`, and/or `onFailure`.

A plugin should be a function that returns an object of the type Plugin:
```ts
type Plugin = {
    onStart?: Hook;
    onSuccess?: Hook;
    onFailure?: Hook;
};
```

### Basic Plugin Example
Create a file (eg. `myPlugin.js`):
```js
export const myPlugin = () => ({
    onStart: () => {
        console.log("Plugin: Flow step is starting...");
    },
    onSuccess: () => {
        console.log("Plugin: Step completed successfully!");
    }
});
```
This plugin exports a function that returns an object containing hooks.

Use it in your `jido.config.js` as follows:
```js
import { myPlugin } from "./myPlugin.js";

export default jido({
  flows: [
    {
      name: "example",
      steps: [
        {
          run: "echo hello",
          onStart: () => console.log("Echo step started..."),
          plugins: [myPlugin()]
        }
      ]
    }
  ]
});
```

### Plugin as an Object (Not Recommended)
You can also pass a plugin directly as an object:
```js
// Plugin
const myPlugin = {
    onStart: () => {
        console.log("Plugin: Flow step started...");
    },
    onSuccess: () => {
        console.log("Plugin: Step completed successfully!");
    }
};

// jido.config.js
plugins: [myPlugin]  // Directly passes the object, unlike previous example where a function was called to return the object
```

This works fine, but using **functions that return plugin objects** is recommended — especially when your plugin logic needs configuration or arguments.

### Plugins with arguments
Plugins can be dynamic:
```js
// Plugin
const myPlugin = (name) => ({
    onStart: () => {
        console.log(`Hello, ${name}! Starting the flow step...`);
    }
});

// jido.config.js
plugins: [myPlugin("Bob")]  // Dynamic plugins, hooks dependent on arguments
```
This pattern keeps your plugins composable, configurable, and scalable.

### 🧠 Tip
You can enable better IntelliSense by adding this at the top of your plugin file:
```js
/** @type {import("jido-kit/types").Plugin} */
```

## Dry Run Mode
You can simulate a flow with:
```bash
jido flow build --dry-run
```
This prints the commands without executing them. Helpful for debugging.

## Example Use Cases
- `deploy`: Run build scripts and deploy using CLI tools.
- `validate`: Combine linting, testing, type checking tools into one command.
- `reset`: Clear caches, reinstall steps, reset DB, etc.

You are free to define **any set of shell commands** that makes sense for your workflow.

## FAQ

<details>

<summary>
- Can I use JS logic inside `jido.config.js`?
</summary>

Yes! It's a JS file, not JSON, so you can use variables, imports, etc.

</details>

<details>

<summary>
- Does it support `.ts` config?
</summary>

Not currently. However, you can use types from `jido-kit` to make custom plugins and build them into JS functions to be used as plugins in your jido config.

</details>

## Bonus: Type Support (`jido-kit`)
Install `jido-kit` for full IntelliSense in VS Code:
```bash
npm install --save-dev jido-kit
```
Then, in your config:
```js
/** @type {import("jido-kit/types").Config} */

export default jido({
    ...
});
```

## Why use Jido?
✅ Clean alternative to npm run clutter
✅ Centralizes all your workflows
✅ Dry-run support for safety
✅ Lightweight and dependency-free core
✅ Config in JS — not YAML or JSON

## License
MIT

