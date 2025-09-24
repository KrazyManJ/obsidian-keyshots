import { Category } from "src/constants/Category"
import KeyshotsCommand from "src/model/KeyshotsCommand"
import { HotKey } from "src/utils"

export const indent: KeyshotsCommand = {
    category: Category.EDITOR_LINES_MANIPULATION,
    id: 'indent',
    name: "Indent",
    hotkeys: {
        keyshots: [HotKey("]","Alt")]
    },
    editorCallback: (editor) => editor.exec("indentMore")   
}


export const unindent: KeyshotsCommand = {
    category: Category.EDITOR_LINES_MANIPULATION,
    id: 'unindent',
    name: "Unindent",
    hotkeys: {
        keyshots: [HotKey("[","Alt")]
    },
    editorCallback: (editor) => editor.exec("indentLess")
}