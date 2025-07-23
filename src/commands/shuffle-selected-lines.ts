import {Category} from "../constants/Category";
import KeyshotsCommand from "../model/KeyshotsCommand";
import SelectionsProcessing from "../classes/SelectionsProcessing";
import KeyshotsPlugin from "../plugin";
import {HotKey} from "../utils";

export const shuffleSelectedLines: (plugin: KeyshotsPlugin) => KeyshotsCommand = (plugin) => ({
    category: Category.EDITOR_LINES_MANIPULATION,
    id: 'shuffle-selected-lines',
    name: "Shuffle selected lines",
    hotkeys: {
        keyshots: [HotKey("S", "Mod", "Shift", "Alt")]
    },
    editorCallback: (editor) => SelectionsProcessing.selectionsProcessor(editor, arr => arr.filter(s => !s.isCaret()), sel => {
        const replaceSel = sel.asNormalized().expand()
        let txt = replaceSel.getText()
        const rounds = plugin.settings.shuffle_rounds_amount
        for (let i = 0; i < rounds; i++) txt = txt.split("\n").sort(() => Math.random() - 0.5).join("\n")
        replaceSel.replaceText(txt)
        return sel
    })
})