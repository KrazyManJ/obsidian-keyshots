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
    editorCallback: (editor) => {
        const shuffleLines = (text: string, rounds: number) => {
            for (let i = 0; i < rounds; i++) {
                text = text.split("\n").sort(() => Math.random() - 0.5).join("\n")
            }
            return text
        }
        
        SelectionsProcessing.selectionsProcessorTransaction(editor, sel => {
            const shuffledText = shuffleLines(sel.clone().expand().getText(), plugin.settings.shuffle_rounds_amount)

            return {
                replaceSelection: sel.clone().expand(),
                replaceText: shuffledText
            }
        }, arr => arr.filter(s => !s.isCaret()), false)
    }
})