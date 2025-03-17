import {Category} from "../constants/Category";
import VerticalDirection from "../constants/VerticalDirection";
import KeyshotsCommand from "../model/KeyshotsCommand";
import {Editor} from "obsidian";
import EditorPositionManipulator from "../classes/EditorPositionManipulator";
import {HotKey} from "../utils";

function goToFolding(editor: Editor, direction: VerticalDirection) {
    const cursor = EditorPositionManipulator.mainCursor(editor);

    const isDown = () => direction == VerticalDirection.DOWN

    if (!editor.getValue().substring(
        isDown() ? cursor.toOffset() : 0,
        isDown() ? undefined : cursor.toOffset()
    ).includes("\n")) return;

    const browseDoc = editor.getValue().substring(
        isDown() ? cursor.clone().movePos(1, 0).moveToStartOfLine().toOffset() : 0,
        isDown() ? undefined : cursor.clone().moveToEndOfLine().toOffset()
    );
    const lines = browseDoc.split("\n");
    if (!isDown()) lines.reverse();

    const currLine = editor.getLine(cursor.line);

    const HEAD_REGEX = /^(#{1,6})\s/;
    const LIST_REGEX = /^([\s\t]*)(?:[0-9]+\.|-(?=\s[^[])|- \[[ x]])\s/;
    const ALL_FOLDING_REGEX = new RegExp(`${HEAD_REGEX.source}|${LIST_REGEX.source}`)

    //HEAD
    let currLineMatch = currLine.match(HEAD_REGEX);
    if (currLineMatch){
        if (!lines.every((v,i) => {
            const m = v.match(HEAD_REGEX)

            if (!m) return true;
            // @ts-ignore
            if (m[1].length < currLineMatch?.[1].length) return false;
            if (m[1] != currLineMatch?.[1]) return true;

            editor.setCursor(cursor.setPos(isDown() ? cursor.line + 1 + i : cursor.line - i, m?.[0].length).toEditorPosition());
            return false;
        })) return;
    }

    //LIST
    currLineMatch = currLine.match(LIST_REGEX)
    if (currLineMatch){
        if (!lines.every((v,i,arr) => {
            const m = v.match(LIST_REGEX)
            if (!m) return true;
            // @ts-ignore
            if (m[1].length < currLineMatch?.[1].length) return false;
            if (m[1] != currLineMatch?.[1]) return true;
            const possibleChild = arr[i+direction] ? arr[i+direction].match(LIST_REGEX) : undefined
            const indentFactor = (currLineMatch[0].startsWith("\t") || (possibleChild && possibleChild[0].startsWith("\t"))) ? 1 : app.vault.getConfig("tabSize")
            if (!(possibleChild && possibleChild[1].length == m[1].length+indentFactor)) return true;
            editor.setCursor(cursor.setPos(isDown() ? cursor.line + 1 + i : cursor.line - i, m?.[0].length).toEditorPosition());
            return false;
        }))
            return;
    }

    //ANYTHING
    lines.every((v,i,arr) => {
        const m = v.match(ALL_FOLDING_REGEX)
        if (!m) return true;
        const indent = m[1] ? m[1] : m[2]
        if (v.match(LIST_REGEX)) {
            const possibleChild = arr[i+direction] ? arr[i+direction].match(LIST_REGEX) : undefined
            const indentFactor = possibleChild && possibleChild[0].startsWith("\t") ? 1 : app.vault.getConfig("tabSize")
            if (!(possibleChild && possibleChild[1].length == indent.length+indentFactor)) return true;
        }
        editor.setCursor(cursor.setPos(isDown() ? cursor.line + 1 + i : cursor.line - i, m?.[0].length).toEditorPosition());
        return false;
    })
}

export const goToNextFold: KeyshotsCommand = {
    category: Category.TRANSFORM_SELECTIONS,
        id: 'go-to-next-fold',
    name: "Go to next fold",
    hotkeys: {
        keyshots: [HotKey("]", "Mod", "Alt")]
    },
    editorCallback: (editor) => goToFolding(editor, VerticalDirection.DOWN)
}

export const goToPreviousFold: KeyshotsCommand ={
    category: Category.TRANSFORM_SELECTIONS,
        id: 'go-to-previous-fold',
    name: "Go to previous fold",
    hotkeys: {
        keyshots: [HotKey("[", "Mod", "Alt")]
    },
    editorCallback: (editor) => goToFolding(editor, VerticalDirection.UP)
}