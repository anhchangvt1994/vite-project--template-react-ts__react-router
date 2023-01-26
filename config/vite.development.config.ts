import type { RollupAliasOptions } from "@rollup/plugin-alias";
import type { UserConfig } from "vite";

export default async (): Promise<UserConfig> => {
  await initENVHandler();
  return {};
};

export const aliasExternal: RollupAliasOptions = {}; // alias

const initENVHandler = async () => {
  await import("./types/dts-generator.mjs").then(async (data) => {
    if (!data) return;

    return await data.promiseENVWriteFileSync.then(async function () {
      const nodemon = (await import("nodemon"))?.default;

      nodemon({
        script: "./config/types/dts-generator.mjs",
        stdout: false,
        quiet: true,
        watch: "./env/env*.mjs",
        runOnChangeOnly: true,
      });
    });
  });
}; // initENVHandler()
