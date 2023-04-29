import * as svgs from "../svgs";

export interface IDEInfo {
    name: string,
    description: string,
    svg_icon_content: string
}


export const IDE_LABELS: Record<string,IDEInfo> = {
    "clear": {
        name: "Clear",
        description: "Everything is blank, default preset when you install Keyshots",
        svg_icon_content: svgs.EMPTY_SVG
    },
    "vscode": {
        name: "Visual Studio Code",
        description: "Compact text editor and light IDE for Web or Python development",
        svg_icon_content: svgs.VSCODE_SVG
    },
    "jetbrains": {
        name: "JetBrains IDEs",
        description: "Family of IDEs (IntelliJ IDE, Pycharm, PhpStorm, ...) made by company JetBrains",
        svg_icon_content: svgs.JETBRAINS_SVG
    },
    "visual_studio": {
        name: "Microsoft Visual Studio",
        description: "IDE for making windows desktop apps, or any other programs using C-Family languages",
        svg_icon_content: svgs.VS_SVG
    },
    "keyshots": {
        name: "Keyshots Default Mappings",
        description: "HotKeys designed by creator of Keyshots that are 100% conflict free",
        svg_icon_content: svgs.KEYSHOTS_SVG
    }
}