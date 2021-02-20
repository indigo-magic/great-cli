#! /usr/bin/env node

// const program = require('commander');  // 解析命令;
// const cac = require('cac');
// const chalk = require('chalk');  // 命令行界面输出美颜
// const fs = require('fs-extra');  // fs的拓展;
// const shell = require('shelljs');  // 重新包装了 child_process；
// const inquirer = require('inquirer');  // 交互式问答；
// const ora = require('ora');  // 输出样式美化；
// const ejs = require('ejs');  // 模版引擎；
// const path = require('path');
import cac from "cac";

import { CreateOptions, UserConfig, resolveConfig } from "./config";

// const currentPath = process.cwd();
// let answersConfig = null;

const cli = cac("great");

cli.option("-c --config <file>", `[string] use specified config file`);
// .option('') // will join debug log

// create master app

cli
  .command("create [name]")
  .option(
    "--template <type>",
    "choose master application framework type, one of type [vue, react]"
  )
  .action(async (name: string, options: CreateOptions & UserConfig) => {
    // console.log(name, options);
    const { create } = await import("./cli/create");

    const config = resolveConfig(options.config);
    // console.log(currentPath);
    create({ ...config, template: options.template, name });
  });

// dev

cli.command("[root]").alias("serve");

cli.help();
cli.parse();
