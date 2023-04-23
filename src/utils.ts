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