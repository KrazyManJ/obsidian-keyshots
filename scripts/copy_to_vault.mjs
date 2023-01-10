import { existsSync, copyFileSync } from "fs";
import {join, basename, dirname} from "path";
import DEV_TEST_PLUGIN_PATH from "./paths.mjs";
import { fileURLToPath } from 'url';
if (!existsSync(DEV_TEST_PLUGIN_PATH)) { throw new Error("Destination does not exist!"); };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname,"..")

const manifestPath = join(root,"manifest.json");
const mainPath = join(root,"main.js");
[mainPath,manifestPath].forEach(f => copyFileSync(f,join(DEV_TEST_PLUGIN_PATH,basename(f))));