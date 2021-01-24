#! /usr/bin/env node

const program = require('commander');  // 解析命令;
const chalk = require('chalk');  // 命令行界面输出美颜
const fs = require('fs-extra');  // fs的拓展;
const shell = require('shelljs');  // 重新包装了 child_process；
const inquirer = require('inquirer');  // 交互式问答；
const ora = require('ora');  // 输出样式美化；
const ejs = require('ejs');  // 模版引擎；
const path = require('path');
const currentPath = process.cwd();
let answersConfig = null;




