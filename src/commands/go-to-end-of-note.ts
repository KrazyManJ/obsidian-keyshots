import { Category } from "@/constants/Category";
import KeyshotsCommand from "@/model/KeyshotsCommand";

export const goToEndOfNote: KeyshotsCommand = {
    category: Category.TRANSFORM_SELECTIONS,
    id: "go-to-end-of-note",
    name: "Go to end of note",
    editorCallback: (editor) => editor.exec("goEnd")
}