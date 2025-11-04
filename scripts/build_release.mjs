import JSZip from "jszip";
import {
    readFileSync,
    unlinkSync,
    createWriteStream,
    mkdirSync,
    existsSync,
    copyFileSync,
    readdirSync,
} from "fs";
import { join, basename, dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const root = join(__dirname, "..");

const releaseFolder = join(root, "release");
const manifestPath = join(root, "manifest.json");
const mainPath = join(root, "main.js");
const stylePath = join(root, "styles.css");

if (!existsSync(releaseFolder)) mkdirSync(releaseFolder);

readdirSync(releaseFolder).forEach((file) => {
    if (file.endsWith(".zip")) unlinkSync(join(releaseFolder, file));
});

const release_zip = new JSZip();

const manifestFile = readFileSync(manifestPath);
const manifest = JSON.parse(manifestFile);

const pluginName = manifest["id"];
const pluginVersion = manifest["version"];

release_zip.file(`${pluginName}/manifest.json`, manifestFile);
release_zip.file(`${pluginName}/main.js`, readFileSync(mainPath));
release_zip.file(`${pluginName}/styles.css`, readFileSync(stylePath));

release_zip
    .generateNodeStream({ type: "nodebuffer", streamFiles: true })
    .pipe(
        createWriteStream(
            join(
                __dirname,
                "..",
                "release",
                `${pluginName}-${pluginVersion}.zip`
            )
        )
    );

const filesToCopy = [mainPath, manifestPath, stylePath];

filesToCopy.forEach((f) =>
    copyFileSync(f, join(releaseFolder + `/${basename(f)}`))
);
