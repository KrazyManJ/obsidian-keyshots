import EditorSelectionManipulator from "./classes/editor-selection-manipulator";
import {App, Editor, EditorRange, MarkdownView, Notice, VaultConfig} from "obsidian";
import KeyshotsPlugin from "./plugin";
import {PrismLanguage} from "./mappings/prism-langs";
import SelectionsProcessing from "./classes/selections-processing"
import {VerticalDirection} from "./classes/vertical-direction";

export function moveLine(editor: Editor, direction: VerticalDirection, border: number) {
    SelectionsProcessing.selectionsProcessor(editor, undefined, (sel) => {
        if (direction === 1 ? sel.asNormalized().head.line === border : sel.asNormalized().anchor.line === border) return sel
        const replaceSel = sel.asNormalized().moveLines(
            direction === -1 ? direction : 0,
            direction === 1 ? direction : 0
        ).expand()
        const tx = replaceSel.getText()
        if (sel.isCaret()) replaceSel.replaceText(tx.split("\n").reverse().join("\n"))
        else {
            const pieces = [
                tx.split("\n").slice(...(direction === 1 ? [-1] : [0, 1]))[0],
                tx.split("\n").slice(...(direction === 1 ? [undefined, -1] : [1])).join("\n")
            ]
            if (direction === -1) pieces.reverse()
            replaceSel.replaceText(pieces.join("\n"))
        }
        return sel.moveLines(direction)
    })
}

export function jetBrainsDuplicate(editor: Editor) {
    SelectionsProcessing.selectionsProcessor(editor, undefined, (sel) => {
        if (sel.isCaret()) {
            const tx = sel.anchor.getLine()
            sel.anchor.setLine(tx + "\n" + tx)
            return sel.moveLines(1)
        } else {
            const tx = sel.asNormalized().getText()
            return sel.asNormalized().replaceText(tx + tx).moveChars(tx.length)
        }
    })
}

export function vscodeDuplicate(editor: Editor, direction: VerticalDirection) {
    SelectionsProcessing.selectionsProcessor(editor, undefined, (sel) => {
        if (sel.isCaret()) {
            const tx = sel.anchor.getLine()
            sel.anchor.setLine(tx + "\n" + tx)
            if (direction > 0) return sel.moveLines(1);
        } else {
            const replaceSel = sel.asNormalized().expand()
            const tx = replaceSel.getText()
            replaceSel.replaceText(tx + "\n" + tx)
            if (direction > 0) return sel.moveLines(sel.linesCount + 1)
        }
        return sel
    })
}

export function addCarets(editor: Editor, direction: VerticalDirection, border: number) {
    const selections: EditorSelectionManipulator[] = EditorSelectionManipulator.listSelections(editor)
        .sort((a, b) => a.anchor.toOffset() - b.anchor.toOffset())
    if (selections.filter(s => !s.isCaret()).length > 0) return
    const main = selections.filter(s => s.anchor.line === editor.getCursor().line && s.anchor.ch === editor.getCursor().ch)[0]
    let mainIndex = selections.indexOf(main)
    const newSel = selections[direction > 0 ? selections.length - 1 : 0].clone()
    if (newSel.anchor.line === border) return
    newSel.moveLines(direction).setChars(Math.min(editor.getLine(newSel.anchor.line).length, main.anchor.ch))
    if (direction === VerticalDirection.DOWN && mainIndex !== 0) selections.shift()
    else if (direction === VerticalDirection.UP && mainIndex !== selections.length - 1) selections.pop()
    else if (direction === VerticalDirection.DOWN) selections.push(newSel)
    else {
        selections.unshift(newSel)
        mainIndex++;
    }
    selections.splice(mainIndex, 1)
    selections.unshift(main)
    editor.setSelections(selections)
    editor.scrollIntoView(newSel.anchor.clone().setPos(
        Math.min(editor.lineCount()-1,newSel.anchor.line+direction * 2), newSel.anchor.ch
    ).asEditorRange())
}

export function insertLine(editor: Editor, direction: VerticalDirection) {
    SelectionsProcessing.selectionsProcessor(editor, (s) => s.sort((a, b) => a.anchor.line - b.anchor.line), (sel, index) => {
        const a = (ln: number) => {
            const tx = [editor.getLine(ln), "\n"]
            if (direction < 0) tx.reverse()
            editor.setLine(ln, tx.join(""))
            return EditorSelectionManipulator.documentStart(editor).setLines(ln + (direction > 0 ? direction : 0))
        }
        if (sel.isCaret()) return a(sel.anchor.line + index)
        else {
            const normSel = sel.asNormalized()
            return a((direction > 0 ? normSel.anchor.line : normSel.head.line) + index)
        }
    })
}

export function flipBooleanSetting(app: App, setting: keyof VaultConfig) {
    app.vault.setConfig(setting, !app.vault.getConfig(setting))
}

export function replaceSelections(editor: Editor, transformFct: (val: string) => string) {
    SelectionsProcessing.selectionsReplacer(editor, transformFct)
}

export function convertURI(editor: Editor) {
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

export function splitSelectedTextOnNewLine(editor: Editor) {
    let index = 0
    SelectionsProcessing.selectionsProcessor(editor, arr => arr.sort((a, b) => a.anchor.line - b.anchor.line), sel => {
        if (sel.isCaret()) return sel
        else {
            const replaceSel = sel.moveLines(index).normalize()
            const tx = replaceSel.getText()
            replaceSel.replaceText("\n" + tx + "\n")
            index += (tx.split("\n") || []).length + 1
            return sel.moveLines(1).expand()
        }
    })
}

export function sortSelectedLines(editor: Editor) {
    SelectionsProcessing.selectionsProcessor(editor, arr => arr.filter(s => !s.isCaret()), sel => {
        const replaceSel = sel.asNormalized().expand()
        replaceSel.replaceText(replaceSel.getText()
            .split("\n")
            .sort((a, b) => a.localeCompare(b, undefined, {numeric: true, sensitivity: "base"}))
            .join("\n")
        )
        return sel
    })
}

export function selectWordInstances(editor: Editor, case_sensitive: boolean) {
    const selections: EditorSelectionManipulator[] = EditorSelectionManipulator.listSelections(editor)
    let range: EditorRange | undefined;
    if (selections.filter(s => s.isCaret()).length > 0) {
        selections.filter(s => s.isCaret()).forEach((sel, i) => selections[i] = sel.selectWord())
    } else if (selections.filter(s => !s.isCaret()).length === selections.length && SelectionsProcessing.selectionValuesEqual(selections, case_sensitive)) {
        const sel = SelectionsProcessing.lowestSelection(selections).normalize()
        const tx = !case_sensitive ? sel.getText().toLowerCase() : sel.getText()

        const match = (!case_sensitive ? editor.getValue().toLowerCase() : editor.getValue()).substring(sel.head.toOffset()).match(tx)
        if (match !== null) {
            const matchSel = EditorSelectionManipulator.documentStart(editor).setChars(sel.head.toOffset())
                .moveChars(match.index ?? 0, (match.index ?? 0) + tx.length)
            selections.push(matchSel)
            range = matchSel.asEditorRange()
        } else {
            let editorSearchText = !case_sensitive ? editor.getValue().toLowerCase() : editor.getValue()
            let shift = 0
            let match = editorSearchText.match(tx)
            while (match !== null) {
                const prevTx = (!case_sensitive ? editor.getValue().toLowerCase() : editor.getValue()).substring(0, shift + (match?.index || 0))
                const sel = EditorSelectionManipulator.documentStart(editor).moveChars(prevTx.length, prevTx.length + tx.length)
                if (selections.filter(s => s.equals(sel)).length === 0) {
                    selections.push(sel)
                    range = sel.asEditorRange()
                    break;
                } else {
                    shift += (match?.index || 0) + tx.length
                    editorSearchText = editorSearchText.substring((match?.index || 0) + tx.length)
                }
                match = editorSearchText.match(tx)
            }
        }
    } else return;
    editor.setSelections(selections);
    if (range !== undefined) editor.scrollIntoView(range);
}

export function selectAllWordInstances(editor: Editor, case_sensitive: boolean) {
    const selections: EditorSelectionManipulator[] = EditorSelectionManipulator.listSelections(editor)
    selections.filter(s => s.isCaret()).forEach((sel, i) => selections[i] = sel.selectWord())
    if (selections.filter(s => !s.isCaret()).length === selections.length && SelectionsProcessing.selectionValuesEqual(selections, case_sensitive)) {
        const tx = selections[0].getText()
        Array.from(editor.getValue().matchAll(new RegExp(tx, "g" + (case_sensitive ? "" : "i"))), v => v.index || 0)
            .forEach(v => {
                selections.push(EditorSelectionManipulator.documentStart(editor).moveChars(v, v + tx.length))
            })
    } else return;
    editor.setSelections(selections);
}

export function expandSelections(editor: Editor) {
    SelectionsProcessing.selectionsProcessor(editor, undefined, sel => sel.expand())
}

export async function toggleCaseSensitivity(plugin: KeyshotsPlugin) {
    plugin.settings.case_sensitive = !plugin.settings.case_sensitive
    const val = plugin.settings.case_sensitive
    new Notice(`${val ? "🔒" : "🔓"} Keyshots actions are now case ${val ? "" : "in"}sensitive!`)
    await plugin.saveSettings()
}

export function splitSelectionsByLines(editor: Editor) {
    SelectionsProcessing.selectionsUpdater(editor, undefined, sel => {
        const selections: EditorSelectionManipulator[] = [];
        if (sel.isCaret() || sel.isOneLine()) selections.push(sel)
        else {
            sel.normalize()
            selections.push(sel.clone().setLines(sel.anchor.line).setChars(sel.anchor.ch, editor.getLine(sel.anchor.line).length))
            for (let i = sel.anchor.line + 1; i < sel.head.line; i++)
                selections.push(sel.clone().setLines(i).setChars(0, editor.getLine(i).length))
            selections.push(sel.clone().setLines(sel.head.line).setChars(0, sel.head.ch))
        }
        return selections
    })
}

export function shuffleSelectedLines(editor: Editor, rounds: number) {
    SelectionsProcessing.selectionsProcessor(editor, arr => arr.filter(s => !s.isCaret()), sel => {
        const replaceSel = sel.asNormalized().expand()
        let txt = replaceSel.getText()
        for (let i = 0; i < rounds; i++) txt = txt.split("\n").sort(() => Math.random() - 0.5).join("\n")
        replaceSel.replaceText(txt)
        return sel
    })
}

export function openKeyshotsSettings(app: App) {
    if (app.setting.activeTab === null) app.setting.open()
    app.setting.openTabById("keyshots")
}

export function convertOneToOtherChars(editor: Editor, first: string, second: string) {
    replaceSelections(editor, (tx) => {
        const [underI, spaceI] = [tx.indexOf(first), tx.indexOf(second)]
        const replaceFromTo = (s: string, ch1: string, ch2: string) => s.replace(new RegExp(ch1, "gm"), ch2)
        if (underI !== -1 || spaceI !== -1) return tx
        if (underI === -1) return replaceFromTo(tx, second, first)
        if (spaceI === -1) replaceFromTo(tx, first, second)
        if (underI > spaceI) return replaceFromTo(tx, second, first)
        return replaceFromTo(tx, first, second)
    })
}

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

export function insertCodeBlock(editor: Editor, lang: PrismLanguage) {
    let moveLine = 0;
    SelectionsProcessing.selectionsProcessor(editor, undefined, (sel) => {
        sel.moveLines(moveLine)
        moveLine += sel.linesCount + 1
        return sel.normalize()
            .replaceText(`\n\`\`\`${lang.id}\n${sel.getText()}\n\`\`\`\n`)
            .moveLines(2)
            .setChars(0)
            .expand()
    })
}

export function addCaretsViaDoubleKey(plugin: KeyshotsPlugin, ev: KeyboardEvent) {
    if (!["ArrowUp", "ArrowDown"].includes(ev.key)) return
    ev.preventDefault()
    const view = plugin.app.workspace.getActiveViewOfType(MarkdownView)
    if (!view) return;
    addCarets(
        view.editor,
        ev.key === "ArrowUp" ? VerticalDirection.UP : VerticalDirection.DOWN,
        ev.key === "ArrowUp" ? 0 : view.editor.lineCount()
    )
}

export function runCommandById(keyshotsPlugin: KeyshotsPlugin, id: string, notAvailableCallback: () => void) {
    const plugin = keyshotsPlugin.app.internalPlugins.plugins[id.split(":")[0]]
    if (plugin && plugin.enabled) keyshotsPlugin.app.commands.executeCommandById(id)
    else notAvailableCallback()
}

export function insertOrdinalNumbering(editor: Editor) {
    SelectionsProcessing.selectionsProcessor(editor, undefined, (sel,index) => {
        return sel.replaceText((index+1).toString(),true)
    })
}

export function reverseSelectedLines(editor: Editor) {
    SelectionsProcessing.selectionsProcessor(editor, arr => arr.filter(s => !s.isCaret()), sel => {
        const replaceSel = sel.asNormalized().expand()
        replaceSel.replaceText(replaceSel.getText().split("\n").reverse().join("\n"))
        return sel
    })
}

export function insertCallout(editor: Editor, id: string) {
    let moveLine = 0;
    SelectionsProcessing.selectionsProcessor(editor, undefined, (sel) => {
        sel.moveLines(moveLine)
        moveLine += sel.linesCount - 2
        return sel.normalize()
            .replaceText(`\n>[!${id}]\n${sel.getText().split("\n").map(p => "> "+p).join("\n")}\n`)
            .moveLines(2)
            .expand()
            .moveChars(2,0)
    })
}

export function insertTable(editor: Editor, rows: number, column: number) {
    SelectionsProcessing.selectionsProcessor(editor, undefined, (sel) => {
        return sel.normalize().replaceText(
            `\n|${"   |".repeat(column)}\n|${"---|".repeat(column)}${("\n|"+"   |".repeat(column)).repeat(rows)}\n`
        )
            .moveLines(1)
            .moveChars(2)
    })
}
