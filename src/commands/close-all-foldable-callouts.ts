import {Category} from "../constants/Category";
import KeyshotsCommand from "../model/KeyshotsCommand";
import {HotKey} from "../utils";


export const closeAllFoldableCallouts: KeyshotsCommand = {
    category: Category.RENDERED_CONTROLING,
    id: 'close-all-foldable-callouts',
    name: "Close all foldable callouts",
    hotkeys: {
        keyshots: [HotKey("L", "Shift", "Alt")]
    },
    callback: () =>
        document
            .querySelectorAll("div.callout.is-collapsible:not(.is-collapsed) div.callout-title")
            .forEach(c => (c as HTMLDivElement).click())
}