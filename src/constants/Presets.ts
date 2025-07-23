import {satisfies} from "../utils";
import PresetInfo from "../model/PresetInfo";
import * as svgs from "./SVGs";

const presetsInfo = satisfies<Record<string, PresetInfo>>()({
    clear: {
        name: "Clear",
        description: "Everything is blank, default preset when you install Keyshots",
        iconSvgContent: svgs.EMPTY_SVG
    },
    keyshots: {
        name: "Keyshots Default Mappings",
        description: "Hotkeys designed by creator of Keyshots that are 100% conflict free with Obsidian",
        iconSvgContent: svgs.KEYSHOTS_SVG(32)
    },
    vscode: {
        name: "Visual Studio Code",
        description: "Compact text editor and light IDE for Web or Python development",
        iconSvgContent: svgs.VSCODE_SVG
    },
    jetbrains: {
        name: "JetBrains IDEs",
        description: "Family of IDEs (IntelliJ IDEA, Pycharm, PhpStorm, WebStorm, ...) made by company JetBrains",
        iconSvgContent: svgs.JETBRAINS_SVG
    },
    visual_studio: {
        name: "Microsoft Visual Studio",
        description: "IDE for making Windows desktop apps, or any other programs using C-Family languages or Visual Basic",
        iconSvgContent: svgs.VS_SVG
    },
})

export type Preset = keyof typeof presetsInfo

export type ClearPreset = Extract<Preset, "clear">

export const PRESETS_INFO = presetsInfo as Record<Preset,PresetInfo>
