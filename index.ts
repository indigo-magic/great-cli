import cac from "cac";

import { CreateOptions, UserConfig, resolveConfig } from "./config";

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
    const { create } = await import("./cli/create");

    const config = resolveConfig(options.config);
    try {
      create({ ...config, template: options.template, name });
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  });

// dev

cli.command("[root]").alias("serve");

cli.help();
cli.parse();
