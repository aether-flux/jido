#!/usr/bin/env node

import chalk from 'chalk';
import { Command } from 'commander';
import { flow } from './commands/flow.js';
import { list } from './commands/list.js';
import { init } from './commands/init.js';

const program = new Command();

program
  .name("jido")
  .description("CLI tool for automating workflows.")
  .version("1.0.0");

program.command("flow")
  .description("Start the automation workflow")
  .argument("[flowname]", "Name of the flow to execute")
  .option('-d, --dry-run', 'Preview running the flow', false)
  .action(function (flowname, options) {
    console.log("options:", options);
    console.log();
    flow(flowname, options.dryRun);
  });

program.command("list")
  .description("List available flows")
  .action(() => {
    list();
  });

program.command("init")
  .description("Initialize a config file")
  .option('-f, --force', "Overwrite existing config", false)
  .action(function () {
    init(this.opts().force);
  })

program.parse(process.argv);

