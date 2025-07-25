import {Category} from "../constants/Category";
import KeyshotsCommand from "../model/KeyshotsCommand";
import SelectionsProcessing from "../classes/SelectionsProcessing";
import {HotKey} from "../utils";

export const duplicateSelectionOrLine: KeyshotsCommand = {
    category: Category.EDITOR_LINES_MANIPULATION,
    id: 'duplicate-selection-or-line',
    name: 'Duplicate selection or line (JetBrains IDEs)',
    repeatable: true,
    hotkeys: {
        keyshots: [HotKey("D", "Mod", "Alt")],
        vscode: null,
        jetbrains: [HotKey("D", "Mod")],
        visual_studio: [HotKey("D", "Mod")],
    },
    editorCallback: (editor) => {
        SelectionsProcessing.selectionsProcessorTransaction(editor, sel => {
            if (sel.isCaret()) {
                return {
                    replaceSelection: sel.clone().expand(),
                    replaceText: sel.anchor.getLine() + "\n" + sel.anchor.getLine(),
                    finalSelection: sel.moveLines(1),
                }
            }
            else {
                return {
                    replaceSelection: sel,
                    replaceText: sel.getText() + sel.getText(),
                    finalSelection: sel.clone().moveCharsWithoutOffset(sel.getText().length)
                }
            }
        })
    }
}