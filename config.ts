import * as path from "path";
// import { rollup } from "rollup";

export interface CreateOptions {
  template?: "vue" | "react";
  name?: string;
}

export interface UserConfig {
  config?: string;
  targetDir?: string;
  resolvedPath?: string;
}

export async function resolveConfig(configPath?: string) {
  if (!configPath) return {};
  if (!configPath.endsWith(".js")) {
    throw new Error("cannot use another config file");
  }

  let config: UserConfig = {};
  const resolvedPath = path.resolve(configPath);

  try {
    config = require(resolvedPath);
    config.resolvedPath = resolvedPath;
  } catch (err) {
    throw new Error(err);
  }

  return config;
}
