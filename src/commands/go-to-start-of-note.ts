import { Category } from "@/constants/Category";
import KeyshotsCommand from "@/model/KeyshotsCommand";

export const goToStartOfNote: KeyshotsCommand = {
    category: Category.TRANSFORM_SELECTIONS,
    id: "go-to-start-of-note",
    name: "Go to start of note",
    editorCallback: (editor) => editor.exec("goStart")
}