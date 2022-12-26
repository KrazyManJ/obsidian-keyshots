import { existsSync, copyFileSync } from "fs";
import DEV_TEST_PLUGIN_PATH from "./paths.mjs";
if (!existsSync(DEV_TEST_PLUGIN_PATH)) { throw new Error("Destination does not exist!"); };
["main.js","manifest.json"].forEach(f => copyFileSync(f,`${DEV_TEST_PLUGIN_PATH}${f}`));