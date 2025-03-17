import KeyshotsCommand from "../model/KeyshotsCommand";
import {Category} from "../constants/Category";
import {HotKey} from "../utils";


export const openAllFoldableCallouts: KeyshotsCommand = {
    category: Category.RENDERED_CONTROLING,
    id: 'open-all-foldable-callouts',
    name: "Open all foldable callouts",
    hotkeys: {
        keyshots: [HotKey("O", "Shift", "Alt")]
    },
    callback: () => document.querySelectorAll("div.callout.is-collapsible.is-collapsed div.callout-title").forEach(c => (c as HTMLDivElement).click())
}