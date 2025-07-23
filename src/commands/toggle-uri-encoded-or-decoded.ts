import KeyshotsCommand from "../model/KeyshotsCommand";
import {Category} from "../constants/Category";
import {HotKey} from "../utils";
import SelectionsProcessing from "../classes/SelectionsProcessing";

export const toggleUriEncodedOrDecoded: KeyshotsCommand = {
    category: Category.REPLACE_SELECTIONS,
    id: 'toggle-uri-encoded-or-decoded',
    name: "Toggle selections URI encoded/decoded string",
    hotkeys: {
        keyshots: [HotKey("U", "Mod", "Alt")]
    },
    editorCallback: (editor) =>
        SelectionsProcessing.selectionsReplacer(editor, (s) => {
            try {
                const decoded = decodeURI(s)
                if (decoded === s) return encodeURI(s)
                return decoded;
            } catch {
                return encodeURI(s)
            }
        })
}