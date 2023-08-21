import JSZip from "jszip"
import {readFileSync, unlinkSync, createWriteStream, mkdirSync, existsSync, copyFileSync, readdirSync} from "fs";
import {join, basename, dirname} from "path"
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const root = join(__dirname,"..")

const releaseFolder = join(root,"release")
const manifestPath = join(root, "manifest.json")
const mainPath = join(root, "main.js")
const stylePath = join(root, "styles.css")

if (!existsSync(releaseFolder)) mkdirSync(releaseFolder)

readdirSync(releaseFolder).forEach( (file) => {  
    if (file.endsWith(".zip")) unlinkSync(join(releaseFolder, file));
});

const release_zip = new JSZip();

const manifest = readFileSync(manifestPath)
const version = JSON.parse(manifest)["version"]
release_zip.file("obsidian-keyshots/manifest.json",manifest)
release_zip.file("obsidian-keyshots/main.js",readFileSync(mainPath))
release_zip.file("obsidian-keyshots/styles.css",readFileSync(stylePath))

release_zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
    .pipe(createWriteStream(join(__dirname, "..", "release", `obsidian-keyshots-${version}.zip`)));

[mainPath,manifestPath,stylePath].forEach(f => copyFileSync(f,join(releaseFolder+`/${basename(f)}`)));
