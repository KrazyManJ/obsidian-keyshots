import {Editor, EditorSelection} from "obsidian";
import EditorSelectionManipulator from "./EditorSelectionManipulator";


export default abstract class SelectionsProcessing {

    /**
     * Main processing function for selections, handling selections shifting
     * 
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
        let characterShift = 0;
        let totalLineShift = 0;
        (arrCallback ? arrCallback(selections) : selections).forEach((sel, index) => {
            if (lastSelection && lastSelection.isOnSameLine(sel) && sel.isOneLine()) {
                characterShift += lastSelection.replaceSizeChange
                sel.moveChars(characterShift)
            } else if (lastSelection && lastSelection.isOnSameLine(sel)) {
                characterShift += lastSelection.replaceSizeChange
                sel.moveChars(characterShift, 0)
                characterShift = 0
            } else totalLineShift += lastSelection?.replaceLineDifference ?? 0;
            sel.moveLines(totalLineShift)

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

    static surroundWithChars(editor: Editor, chars: string, endchars?: string) {
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

    static convertOneToOtherChars(editor: Editor, first: string, second: string) {
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
}