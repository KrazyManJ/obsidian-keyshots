import {satisfies} from "../utils";
import {PresetInfo} from "../model/PresetInfo";
import * as svgs from "../svgs";

const _PresetsInfo = satisfies<Record<string, PresetInfo>>()({
    clear: {
        name: "Clear",
        description: "Everything is blank, default preset when you install Keyshots",
        svg_icon_content: svgs.EMPTY_SVG
    },
    keyshots: {
        name: "Keyshots Default Mappings",
        description: "Hotkeys designed by creator of Keyshots that are 100% conflict free with Obsidian",
        svg_icon_content: svgs.KEYSHOTS_SVG(32)
    },
    vscode: {
        name: "Visual Studio Code",
        description: "Compact text editor and light IDE for Web or Python development",
        svg_icon_content: svgs.VSCODE_SVG
    },
    jetbrains: {
        name: "JetBrains IDEs",
        description: "Family of IDEs (IntelliJ IDEA, Pycharm, PhpStorm, WebStorm, ...) made by company JetBrains",
        svg_icon_content: svgs.JETBRAINS_SVG
    },
    visual_studio: {
        name: "Microsoft Visual Studio",
        description: "IDE for making Windows desktop apps, or any other programs using C-Family languages or Visual Basic",
        svg_icon_content: svgs.VS_SVG
    },
})

export type Preset = keyof typeof _PresetsInfo

export type ClearPreset = Extract<Preset, "clear">

export const PresetsInfo = _PresetsInfo as Record<Preset,PresetInfo>
