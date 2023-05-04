import {Editor, EditorSelection} from "obsidian";
import EditorSelectionManipulator from "./classes/editor-selection-manipulator";

export const selectionsProcessor = (
    editor: Editor,
    arrCallback: ((arr: EditorSelectionManipulator[]) => EditorSelectionManipulator[]) | undefined,
    fct: (sel: EditorSelectionManipulator, index: number) => EditorSelectionManipulator
) => {
    const selections = EditorSelectionManipulator.listSelections(editor)
    const newSelections: EditorSelection[] = []
    let lastSelection: EditorSelectionManipulator | undefined = undefined
    let shift = 0;
    (arrCallback ? arrCallback(selections) : selections).forEach((sel, index) => {
        if (lastSelection && lastSelection.isOnSameLine(sel) && sel.isOneLine()) {
            shift += lastSelection.replaceSizeChange
            sel.moveChars(shift)
        } else if (lastSelection && lastSelection.isOnSameLine(sel)) {
            shift += lastSelection.replaceSizeChange
            sel.moveChars(shift, 0)
            shift = 0
        } else shift = 0
        lastSelection = fct(sel.clone(), index)
        newSelections.push(lastSelection.toEditorSelection())
    })
    if (newSelections.length > 0) editor.setSelections(newSelections)
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
export const lowestSelection = (selections: EditorSelectionManipulator[]): EditorSelectionManipulator => {
    return selections.sort((a, b) =>
        a.asNormalized().head.toOffset() - b.asNormalized().head.toOffset()
    ).reverse()[0]
}
export const selectionValuesEqual = (editor: Editor, selections: EditorSelectionManipulator[], case_sensitive: boolean): boolean => {
    return selections.every((val, _i, arr) => {
        const [one, two] = [arr[0], val].map(s => s.asNormalized().getText())
        if (!case_sensitive) return one.toLowerCase() === two.toLowerCase()
        return one === two
    })
}