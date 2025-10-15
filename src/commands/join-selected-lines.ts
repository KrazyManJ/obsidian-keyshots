import {Category} from "../constants/Category";
import KeyshotsCommand from "../model/KeyshotsCommand";
import SelectionsProcessing from "../classes/SelectionsProcessing";
import {HotKey, joinLinesMarkdownAware} from "../utils";

export const joinSelectedLines: KeyshotsCommand = {
    category: Category.EDITOR_LINES_MANIPULATION,
    id: 'join-selected-lines',
    name: "Join selected lines",
    hotkeys: {
        keyshots: [HotKey("J", "Mod", "Shift")],
        vscode: [HotKey("J", "Mod")],
        jetbrains: [HotKey("J", "Mod", "Shift")]

    },
    editorCallback: (editor) => {

        SelectionsProcessing.selectionsProcessorTransaction(editor, sel => {
            if (sel.isCaret() || sel.isOneLine()) {
                if (sel.anchor.line === editor.lineCount()-1) {
                    return {
                        finalSelection: sel,
                        replaceSelection: sel,
                        replaceText: sel.getText()
                    }
                }
                if (sel.isOneLine() && !sel.isCaret()) {
                    return {
                        finalSelection: sel.clone(),
                        replaceSelection: sel.moveLines(0,1).expand(),
                        replaceText: joinLinesMarkdownAware(sel.getText())
                    }
                }

                return {
                    finalSelection: sel.clone().setChars(sel.anchor.getLine().length),
                    replaceSelection: sel.moveLines(0,1).expand(),
                    replaceText: joinLinesMarkdownAware(sel.getText()),
                }
            }

            const anchor = sel.asNormalized().anchor
            const length = sel.getText().length
            return {
                finalSelection: sel.asNormalized().collapse().setChars(anchor.ch, anchor.ch + length),
                replaceText: joinLinesMarkdownAware(sel.getText()),
                replaceSelection: sel
            }
        },
        array => {
            let lastIndex = -1;
            return array
                .sort((a,b) => a.anchor.line - b.anchor.line)
                .filter((sel,i,arr) => {
                if (i === 0) return true;
                
                const prev = arr[i-1];
                
                if (prev.anchor.line === sel.anchor.line - 1 && lastIndex !== i-1) {
                    if (!prev.isCaret()) {
                        prev.head = sel.head
                    }
                    lastIndex = i
                    return false;
                }
                return true;
            })
        },false)
    }
}
