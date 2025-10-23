import { Category } from "src/constants/Category";
import KeyshotsCommand from "src/model/KeyshotsCommand";

export const goToEndOfNote: KeyshotsCommand = {
    category: Category.TRANSFORM_SELECTIONS,
    id: "go-to-end-of-note",
    name: "Go to end of note",
    editorCallback: (editor) => editor.exec("goEnd")
}