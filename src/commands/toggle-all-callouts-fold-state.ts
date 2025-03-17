import {Category} from "../constants/Category";
import KeyshotsCommand from "../model/KeyshotsCommand";
import {HotKey} from "../utils";


export const toggleAllCalloutsFoldState: KeyshotsCommand =  {
    category: Category.RENDERED_CONTROLING,
    id: 'toggle-all-callouts-fold-state',
    name: "Toggle all callouts fold state",
    hotkeys: {
        keyshots: [HotKey("K", "Shift", "Alt")]
    },
    callback: () => document.querySelectorAll("div.callout div.callout-title").forEach(c => (c as HTMLDivElement).click())
}