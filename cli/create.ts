import * as fs from "fs-extra";
import * as path from "path";
// const inquirer = require('inquirer');  // 交互式问答；
import * as inquirer from "inquirer";

import { CreateOptions, UserConfig } from "../config";

const currentPath = process.cwd();

export async function create(options: CreateOptions & UserConfig) {
  const targetDir = path.resolve(currentPath, options.name || "");

  await fs.ensureDir(targetDir);
  const existing = await fs.readdir(targetDir);

  // console.log(options);
  if (existing.length) {
    console.error(`Error: target directory is not empty.`);
    process.exit(1);
  }

  const renameFiles = {
    _gitignore: ".gitignore",
  };
  const templateDir = path.join(
    path.normalize(__dirname + "/..") +
      `/template/template-${options.template || "vue"}`
  );

  const writePackageJson = async () => {
    const pkg = require(path.join(templateDir, `package.json`));
    pkg.name = options.name;
    await fs.writeFile(
      path.join(targetDir, "package.json"),
      JSON.stringify(pkg, null, 2)
    );
  };
  const templateFiles = await fs.readdir(templateDir);

  for (const fileName of templateFiles.filter((i) => i !== "package.json")) {
    await fs.copy(path.join(templateDir + fileName), targetDir);
  }
  await writePackageJson();

  const promptList = [
    {
      type: "confirm",
      message: "Whether to add plugin ?",
      name: "whether",
      prefix: "前缀",
    },
    {
      type: "list",
      message: "请选择插件:",
      name: "preInstallplugin",
      when: (answers: any) => answers.whether
     
    },
  ];

  const answers = await inquirer.prompt(promptList);

  console.log("done!");
}
