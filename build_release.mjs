import JSZip from "jszip"
import {readFileSync, unlinkSync, createWriteStream, mkdirSync, existsSync, copyFileSync, readdirSync} from "fs";
import {join} from "path"


if (!existsSync("release")) mkdirSync("release")

readdirSync("release").forEach( (file) => {  
    if (file.endsWith(".zip")) unlinkSync(join("release", file));
});

const release_zip = new JSZip();

const manifest = readFileSync("manifest.json")
const version = JSON.parse(manifest)["version"]
release_zip.file("obsidian-keyshots/manifest.json",manifest)
release_zip.file("obsidian-keyshots/main.js",readFileSync("main.js"))

release_zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
    .pipe(createWriteStream(`release/obsidian-keyshots-${version}.zip`));

["main.js","manifest.json"].forEach(f => copyFileSync(f,`release/${f}`));
