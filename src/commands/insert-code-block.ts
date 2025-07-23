import KeyshotsPlugin from "../plugin";
import KeyshotsCommand from "../model/KeyshotsCommand";
import {Category} from "../constants/Category";
import CodeBlockModal from "../components/code-block-modal";
import SelectionsProcessing from "../classes/SelectionsProcessing";
import {HotKey} from "../utils";

export const insertCodeBlock: (plugin: KeyshotsPlugin) => KeyshotsCommand = (plugin) => ({
    category: Category.INSERT_COMPONENTS,
    id: 'insert-code-block',
    name: "Insert code block",
    hotkeys: {
        keyshots: [HotKey("`", "Mod", "Shift")]
    },
    editorCallback: (editor) => new CodeBlockModal(plugin,
        (lang) => {
            SelectionsProcessing.selectionsProcessor(editor, undefined, (sel) => {
                return sel.normalize()
                    .replaceText(`\n\`\`\`${lang.id}\n${sel.getText()}\n\`\`\`\n`)
                    .moveLines(2)
                    .setChars(0)
                    .expand()
            })
            editor.focus()
        }
    ).open()
})