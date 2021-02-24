import * as fs from "fs-extra";
import * as path from "path";
import { prompt } from "enquirer";
import { yellow, red, green } from "chalk";
import { template } from "lodash";

import { CreateOptions, UserConfig } from "../config";

type PluginAnswers = Array<string | never>;

const currentPath = process.cwd();

const supportTemplate = ["vue", "react"];

const excludeFiles = ["package.json", "vite.config.js"];

const commonPluginChoices = [
  { name: "vite-plugin-eslint", version: "1.1.0" },
  { name: "vite-plugin-pwa", version: "0.5.3" },
  { name: "vite-plugin-mock", version: "2.1.4" },
];

export async function create(options: CreateOptions & UserConfig) {
  const targetDir = path.join(currentPath, options.name || "");
  let templateType = options.template || "";
  let preInstallPlugin: PluginAnswers = [];

  if (!templateType || !supportTemplate.includes(templateType)) {
    console.log(
      yellow(
        "# You must select the template type and the template type conforms to the specification"
      )
    );
    const { chooseType } = await prompt<{ chooseType: string }>({
      type: "select",
      message: "select the template type:",
      name: "chooseType",
      choices: supportTemplate,
    });

    templateType = chooseType;
  }

  await fs.ensureDir(targetDir);
  const existing = await fs.readdir(targetDir);
  if (existing.length) {
    console.error(red(`Error: target directory is not empty.`));
    process.exit(1);
  }

  const renameFiles: Record<string, string> = {
    _gitignore: ".gitignore",
  };

  const templateDir = path.join(
    path.normalize(__dirname + "/..") + `/template/template-${templateType}`
  );

  const writePackageJson = async () => {
    const pkg = require(path.join(templateDir, `package.json`));
    pkg.name = options.name;
    if (preInstallPlugin.length) {
      commonPluginChoices
        .filter((pluginInfo) => preInstallPlugin.includes(pluginInfo.name))
        .reduce((deps, cur) => {
          deps[cur.name] = cur.version;
          return deps;
        }, pkg.dependencies);
    }
    await fs.writeFile(
      path.join(targetDir, "package.json"),
      JSON.stringify(pkg, null, 2)
    );
  };

  const writeViteConfig = () => {
    const viteConfigFile = fs.readFileSync(
      path.join(templateDir, `vite.config.js`)
    );
    const viteConfigCompiled = template(viteConfigFile.toString());
    fs.writeFileSync(
      path.join(targetDir, "vite.config.js"),
      viteConfigCompiled({ preInstallPlugin })
    );
  };

  const copyTemplateFile = async () => {
    const templateFiles = await fs.readdir(templateDir);
    for (const fileName of templateFiles.filter(
      (i) => !excludeFiles.includes(i)
    )) {
      const targetPath = path.join(
        targetDir,
        renameFiles[fileName] ? renameFiles[fileName] : fileName
      );
      console.log(targetPath);
      await fs.copy(path.join(templateDir, fileName), targetPath);
    }
  };

  const askNeedPlugin = async () => {
    const { whether } = await prompt<{ whether: boolean }>({
      type: "confirm",
      message: "Whether to add plugin ?",
      name: "whether",
      initial: "Y",
    });
    if (!whether) return;

    const { preInstallpluginAns = [] } = await prompt<{
      preInstallpluginAns: string[];
    }>({
      type: "multiselect",
      message: "please choose plugin:",
      name: "preInstallpluginAns",
      choices: commonPluginChoices.map((i) => i.name),
    });
    preInstallPlugin = preInstallpluginAns;
  };

  try {
    await copyTemplateFile();

    await askNeedPlugin();

    await writePackageJson();
  } catch (err) {
    console.log(red(err));
    process.exit(1);
  }

  writeViteConfig();
  console.log(green("done!"));
}
