import { Category } from "src/constants/Category";
import KeyshotsCommand from "src/model/KeyshotsCommand";

export const goToStartOfNote: KeyshotsCommand = {
    category: Category.TRANSFORM_SELECTIONS,
    id: "go-to-start-of-note",
    name: "Go to start of note",
    editorCallback: (editor, view) => editor.exec("goStart")
}