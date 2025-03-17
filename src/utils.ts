import {App, Editor, Hotkey, Modifier} from "obsidian";
import SelectionsProcessing from "./classes/SelectionsProcessing";


export const HotKey = (key: string, ...mods: Modifier[]): Hotkey => ({key: key, modifiers: mods})

export const satisfies = <T,>() => <U extends T>(u: U) => u;

export function surroundWithChars(editor: Editor, chars: string, endchars?: string) {
    SelectionsProcessing.selectionsProcessor(editor, undefined, (sel) => {
        const surroundSel = sel.clone().normalize().moveChars(-chars.length, (endchars ?? chars).length);
        if (surroundSel.getText().startsWith(chars) && surroundSel.getText().endsWith(endchars ?? chars)) {
            return surroundSel.replaceText(
                surroundSel.getText().substring(chars.length, surroundSel.getText().length - (endchars ?? chars).length)
            ).moveChars(0, -chars.length - (endchars ?? chars).length)
        }
        return sel.replaceText(chars + sel.getText() + (endchars ?? chars)).moveChars(chars.length, sel.isOneLine() ? chars.length : 0)
    })
}

export function convertOneToOtherChars(editor: Editor, first: string, second: string) {
    SelectionsProcessing.selectionsReplacer(editor, (tx) => {
        const [underI, spaceI] = [tx.indexOf(first), tx.indexOf(second)]
        const replaceFromTo = (s: string, ch1: string, ch2: string) => s.replace(new RegExp(ch1, "gm"), ch2)
        if (underI !== -1 || spaceI !== -1) return tx
        if (underI === -1) return replaceFromTo(tx, second, first)
        if (spaceI === -1) replaceFromTo(tx, first, second)
        if (underI > spaceI) return replaceFromTo(tx, second, first)
        return replaceFromTo(tx, first, second)
    })
}

export function flipBooleanSetting(
    app: App,
    setting: { [k in keyof VaultConfig]: VaultConfig[k] extends boolean ? k : never }[keyof VaultConfig]
) {
    app.vault.setConfig(setting, !app.vault.getConfig(setting))
}