import {Editor, EditorSelection} from "obsidian";
import EditorSelectionManipulator from "./editor-selection-manipulator";


export default abstract class SelectionsProcessing {

    /**
     * Main processing function for selections, handling selections shifting
     * @param editor Obsidian Markdown Editor instance
     * @param arrCallback callback to change array before iteration
     * @param fct function to run code for each selection in editor
     */
    static selectionsProcessor(
        editor: Editor,
        arrCallback: ((arr: EditorSelectionManipulator[]) => EditorSelectionManipulator[]) | undefined,
        fct: (sel: EditorSelectionManipulator, index: number) => EditorSelectionManipulator
    ): void {
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


    /**
     * Replaces text in all selections using function
     * @param editor Obsidian Markdown Editor instance
     * @param fct function to run on each selection
     */
    static selectionsReplacer(editor: Editor, fct: (val: string) => string): void {
        this.selectionsProcessor(editor, (arr) => arr.filter(s => !s.isCaret()), sel => sel.replaceText(fct(sel.getText()), true))
    }

    /**
     * Function that is similar to SelectionsProcessing.selectionsProcessor() function
     * except this can take multiple selections in return value in fct
     * @param editor Obsidian Markdown Editor instance
     * @param arrCallback callback to change array before iteration
     * @param fct function to run code for each selection in editor
     */
    static selectionsUpdater(
        editor: Editor,
        arrCallback: ((arr: EditorSelectionManipulator[]) => EditorSelectionManipulator[]) | undefined,
        fct: (sel: EditorSelectionManipulator, index: number) => EditorSelectionManipulator[]
    ) {
        const selections = EditorSelectionManipulator.listSelections(editor)
        const newSelections: EditorSelection[] = [];
        (arrCallback ? arrCallback(selections) : selections).forEach((sel, index) =>
            newSelections.push(...fct(new EditorSelectionManipulator(sel, editor), index).map(sel => sel.toEditorSelection()))
        )
        if (newSelections.length > 0) editor.setSelections(newSelections)
    }


    static lowestSelection(selections: EditorSelectionManipulator[]): EditorSelectionManipulator {
        return selections.sort((a, b) =>
            a.asNormalized().head.toOffset() - b.asNormalized().head.toOffset()
        ).reverse()[0]
    }

    static selectionValuesEqual(selections: EditorSelectionManipulator[], case_sensitive: boolean): boolean {
        return selections.every((val, _i, arr) => {
            const [one, two] = [arr[0], val].map(s => s.asNormalized().getText())
            if (!case_sensitive) return one.toLowerCase() === two.toLowerCase()
            return one === two
        })
    }
}