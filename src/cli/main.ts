#!/usr/bin/env node

import chalk from 'chalk';
import { Command } from 'commander';
import { flow } from './commands/flow.js';

const program = new Command();

program
  .name("jido")
  .description("CLI tool for automating workflows.")
  .version("0.1.0");

program.command("flow [flowname]")
  .description("Start the automation workflow")
  .action((flowname) => {
    console.log();
    flow(flowname);
  });

program.parse(process.argv);

