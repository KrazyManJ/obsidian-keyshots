import {Category} from "../model/Category";
import KeyshotsCommand from "../model/KeyshotsCommand";
import SelectionsProcessing from "../classes/SelectionsProcessing";
import {Preset} from "../model/Preset";
import {HotKey} from "../utils";

export const duplicateSelectionOrLine: KeyshotsCommand = {
    category: Category.EDITOR_LINES_MANIPULATION,
    id: 'duplicate-selection-or-line',
    name: 'Duplicate selection or line (JetBrains IDEs)',
    repeatable: true,
    hotkeys: {
        [Preset.KEYSHOTS]: [HotKey("D", "Mod", "Alt")],
        [Preset.JETBRAINS]: [HotKey("D", "Mod")],
        [Preset.VISUAL_STUDIO]: [HotKey("D", "Mod")],
    },
    editorCallback: (editor) => {
        SelectionsProcessing.selectionsProcessor(editor, undefined, (sel) => {
            if (sel.isCaret()) {
                const tx = sel.anchor.getLine()
                sel.anchor.setLine(tx + "\n" + tx)
                return sel.moveLines(1)
            } else {
                const tx = sel.asNormalized().getText()
                return sel.asNormalized().replaceText(tx + tx).moveChars(tx.length)
            }
        })
    }
}