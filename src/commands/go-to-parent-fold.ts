import KeyshotsCommand from "../model/KeyshotsCommand";
import {Category} from "../constants/Category";
import {HotKey} from "../utils";
import EditorPositionManipulator from "../classes/EditorPositionManipulator";

export const goToParentFold: KeyshotsCommand = {
    category: Category.TRANSFORM_SELECTIONS,
    id: 'go-to-parent-fold',
    name: "Go to parent fold",
    hotkeys: {
        keyshots: [HotKey("P", "Mod", "Alt")]
    },
    editorCallback: (editor) => {
        const cursor = EditorPositionManipulator.mainCursor(editor);
        if (!editor.getValue().substring(0, cursor.toOffset()).includes("\n")) return;
        const browseDoc = editor.getValue().substring(0, cursor.clone().movePos(-1, 0).moveToEndOfLine().toOffset());
        const line = editor.getLine(cursor.line);
        const listMatch = line.match(/^((?:\t| {4})*)(-|\d+\.|- \[[x ]]) /)
        if (listMatch) {
            const indentString = listMatch[1];
            const indent = indentString.includes(" ") ? indentString.length / 4 : indentString.length;
            if (!browseDoc.split("\n").reverse().every((v, i) => {
                const prevMatch = v.match(new RegExp(`^(?:\\t| {4}){${indent-1}}(-|\\d+\\.) `));
                if (!prevMatch) return true;
                cursor.setPos(cursor.line - 1 - i, (indentString.includes(" ") ? indent * 4 : indent) + prevMatch[1].length);
                editor.setCursor(cursor.line, cursor.ch);
                return false;
            })) return;
        }
        const headingMatch = line.match(/^(#{1,6}) /);
        if (headingMatch) {
            const headingLevel = headingMatch[1].length;
            if (!browseDoc.split("\n").reverse().every((v, i) => {
                const prevMatch = v.match(new RegExp(`^#{1,${headingLevel-1}} `));
                if (!prevMatch) return true;
                cursor.setPos(cursor.line - 1 - i, prevMatch[0].length);
                editor.setCursor(cursor.line, cursor.ch);
                return false;
            })) return;
        }
        browseDoc.split("\n").reverse().every((v, i) => {
            if (!v.match(/#{1,6} .+/)) return true;
            editor.setCursor(cursor.movePos(-1-i,0).moveToStartOfLine().toEditorPosition());
            return false;
        })
    }
}