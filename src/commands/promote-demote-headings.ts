import { Editor } from "obsidian";
import SelectionsProcessing from "src/classes/SelectionsProcessing";
import KeyshotsCommand from "src/model/KeyshotsCommand";
import { HotKey } from "src/utils";


const CONTAINS_HEADING_REGEX = /^(#{1,6})(.*)$/gm;

function getHeadingLevelFromLine(line: string): number {
    const match: string[] = line.matchAll(CONTAINS_HEADING_REGEX).next().value
    if (!match) {
        return 0;
    }
    return match[1].length ?? 0;
}

function changeHeadingLevelForSelections(editor: Editor, action: "promote" | "demote") {
    SelectionsProcessing.selectionsProcessorTransaction(editor, sel => {
        const text = sel.isCaret() ?  sel.anchor.getLine() : sel.clone().expand().getText()

        const replaceText = text.replace(CONTAINS_HEADING_REGEX, (_, hashtags: string, title: string) => {
            if (action === "promote" && hashtags.length < 6) {
                hashtags += "#"
            }
            else if (action === "demote" && hashtags.length > 1) {
                hashtags = hashtags.substring(1)
            }
            return hashtags+title
        })

        const finalSelection = sel.clone()
        
        if (sel.isCaret()) {
            finalSelection.setChars(getHeadingLevelFromLine(replaceText))
        }

        return {
            finalSelection: finalSelection,
            replaceSelection: sel.clone().expand(),
            replaceText: replaceText
        }
    })
}

export const promoteHeading: KeyshotsCommand = {
    id: 'promote-heading',
    name: "Promote heading",
    hotkeys: {
        keyshots: [
            HotKey("0","Mod","Alt")
        ]
    },
    editorCallback: (editor) => changeHeadingLevelForSelections(editor, "promote")
}

export const demoteHeading: KeyshotsCommand = {
    id: 'demote-heading',
    name: "Demote heading",
    hotkeys: {
        keyshots: [
            HotKey("9","Mod","Alt")
        ]
    },
    editorCallback: (editor) => changeHeadingLevelForSelections(editor, "demote")
}