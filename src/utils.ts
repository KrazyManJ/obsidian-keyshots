import {App, Editor, EditorSelection, Hotkey, Modifier, VaultConfig} from "obsidian";
import EditorSelectionManipulator from "./classes/editor-selection-manipulator";

export const hotKey = (key: string, ...modifiers: Modifier[]): Hotkey[] => [{key: key, modifiers: modifiers}]

export interface Cloneable<T> {
    clone(): T
}

export enum VerticalDirection { UP = -1, DOWN = 1 }

export const flipBooleanSetting = (app: App, setting: keyof VaultConfig) => app.vault.setConfig(setting, !app.vault.getConfig(setting))
export const replaceSelections = (editor: Editor, transformFct: (val: string) => string) => {
    EditorSelectionManipulator.listSelections(editor).filter(s => !s.isCaret()).forEach(sel =>
        sel.normalize().replaceText(transformFct(sel.normalize().getText()))
    )
}
export const selectionsProcessor = (
    editor: Editor,
    arrCallback: ((arr: EditorSelectionManipulator[]) => EditorSelectionManipulator[]) | undefined,
    fct: (sel: EditorSelectionManipulator, index: number) => EditorSelection
) => {
    const selections: EditorSelection[] = [];
    (arrCallback !== undefined
        ? arrCallback(EditorSelectionManipulator.listSelections(editor)) : EditorSelectionManipulator.listSelections(editor))
        .forEach((sel, index) => selections.push(fct(sel, index)))
    if (selections.length > 0) editor.setSelections(selections)
}
export const selectionsUpdater = (
    editor: Editor,
    arrCallback: ((arr: EditorSelection[]) => EditorSelection[]) | undefined,
    fct: (sel: EditorSelectionManipulator, index: number) => EditorSelection[]
) => {
    const selections: EditorSelection[] = [];
    (arrCallback !== undefined
        ? arrCallback(editor.listSelections()) : editor.listSelections())
        .forEach((sel, index) => selections.push(...fct(new EditorSelectionManipulator(sel, editor), index)))
    if (selections.length > 0) editor.setSelections(selections)
}
export const selectionsEqual = (one: EditorSelection, two: EditorSelection) => {
    return one.anchor.ch === two.anchor.ch
        && one.anchor.line === two.anchor.line
        && one.head.line === two.head.line
        && one.head.ch === two.head.ch
}
export const convertOneToOtherChars = (editor: Editor, first: string, second: string) => {
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
export const titleCase = (s: string) => s.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase())
export const lowestSelection = (selections: EditorSelectionManipulator[]): EditorSelectionManipulator => {

    return selections.filter((sel, _i, arr) =>
        sel.asNormalized().head.line === Math.max(...arr.map(s => s.asNormalized().head.line))
    ).filter((sel, _i, arr) =>
        sel.asNormalized().head.ch === Math.max(...arr.map(s => s.asNormalized().head.ch))
    )[0]
}
export const selectionValuesEqual = (editor: Editor, selections: EditorSelectionManipulator[], case_sensitive: boolean): boolean => {
    return selections.every((val, _i, arr) => {
        const [one, two] = [arr[0], val].map(s => s.asNormalized().getText())
        if (!case_sensitive) return one.toLowerCase() === two.toLowerCase()
        return one === two
    })
}

export function selectWord(sel: EditorSelectionManipulator): EditorSelectionManipulator {
    sel = sel.asNormalized().setLines(sel.anchor.line)
    const txt = sel.anchor.getLine()
    const postCh = (txt.substring(sel.anchor.ch).match(/^[^ ()[\]{},;]+/i) ?? [""])[0].length
    const preCh = (txt.substring(0, sel.anchor.ch).match(/[^ ()[\]{},;]+$/i) ?? [""])[0].length
    return sel.setChars(sel.anchor.ch).moveChars(-preCh, postCh)
}