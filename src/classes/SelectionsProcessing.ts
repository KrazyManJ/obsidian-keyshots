import {Editor,  EditorChange,  EditorRangeOrCaret,  EditorTransaction} from "obsidian";
import EditorSelectionManipulator from "./EditorSelectionManipulator";
import ExtendedEditorChange from "src/model/ExtendedEditorChange";


export default abstract class SelectionsProcessing {

    /**
     * Main selection processor with shift-handling,
     * where all actions for multiple selections are processed as one transaction and can be
     * easily undone for all selections with one CTRL+Z
     * 
     * @param editor Obsidian Markdown Editor instance
     * @param fct function to run code for each selection in editor, with return of EditorChange instance
     * @param arrayCallback callback to change array before iteration
     * @param transactionForEachExecution (`true` in default) if set to `false`, each call will not have unique
     * transaction identifier so multiple executions of this method can be grouped into one transaction and `Editor.undo()`
     * method will undo the whole group instead of one execution
     */
    static selectionsProcessorTransaction(
        editor: Editor,
        fct: (sel: EditorSelectionManipulator, index: number) => ExtendedEditorChange,
        arrayCallback?: ((arr: EditorSelectionManipulator[]) => EditorSelectionManipulator[]),
        transactionForEachExecution = true,
    ) {
        let selections = EditorSelectionManipulator.listSelections(editor)

        if (arrayCallback)
            selections = arrayCallback(selections)

        const changes = selections.map((selection,index) => fct(selection, index))

        const transactionObject: EditorTransaction = {}

        const editorChanges: EditorChange[] = changes
            .filter(change => change.replaceSelection && change.replaceText)    
            .map(v => {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const [from,to] = v.replaceSelection!.asFromToPoints()
                return {
                    from: from,
                    to: to,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    text: v.replaceText!
                }
            })

        if (editorChanges.length > 0) {
            transactionObject.changes = editorChanges
        }

        let linesShift = 0
        let characterShift = 0
        let lastFinalSelection: EditorSelectionManipulator | undefined
        const ranges = changes
            .filter(change => change.finalSelection)
            .map(change => {
                
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const finalSelection = change.finalSelection!

                if (!change.replaceSelection || !change.replaceText) {
                    return finalSelection.toEditorRangeOrCaret()
                }

                const textLengthBefore = change.replaceSelection.getText().length
                const textLengthAfter = change.replaceText.length

                finalSelection.moveLines(linesShift)

                if (lastFinalSelection && lastFinalSelection.isOnSameLine(finalSelection) && finalSelection.isOneLine()) {
                    characterShift += textLengthAfter - textLengthBefore
                    finalSelection.setChars(
                        finalSelection.anchor.ch + characterShift,
                        finalSelection.head.ch + characterShift
                    )
                }
                else if (lastFinalSelection && lastFinalSelection.isOnSameLine(finalSelection)) {
                    characterShift += textLengthAfter - textLengthBefore
                    finalSelection.moveCharsWithoutOffset(characterShift, 0)
                    characterShift = 0
                }
                else {
                    const linesCountBefore = change.replaceSelection.getText().split("\n").length
                    const linesCountAfter = change.replaceText.split("\n").length
                    linesShift += linesCountAfter - linesCountBefore
                }
                
                lastFinalSelection = finalSelection

                return finalSelection.toEditorRangeOrCaret()
            })

        if (ranges.length > 0) {
            transactionObject.selections = ranges
        }
        
        let transactionOriginString: string | undefined
        if (transactionForEachExecution) {
            transactionOriginString = `keyshots-action-${Date.now()}`
        }
        editor.transaction(transactionObject, transactionOriginString)
    }

    /**
     * Replaces text in all selections using function
     * @param editor Obsidian Markdown Editor instance
     * @param fct function to run on each selection
     */
    static selectionsReplacer(editor: Editor, fct: (val: string) => string): void {
        this.selectionsProcessorTransaction(
            editor,
            sel => {
                return {
                    replaceSelection: sel,
                    replaceText: fct(sel.getText())
                }
            },
            array => array.filter(sel => !sel.isCaret())
        )
    }

    /**
     * Function that is similar to SelectionsProcessing.selectionsProcessor() function
     * except this can take multiple selections in return value in fct
     * @param editor Obsidian Markdown Editor instance
     * @param arrayCallback callback to change array before iteration
     * @param fct function to run code for each selection in editor
     */
    static selectionsUpdater(
        editor: Editor,
        arrayCallback: ((arr: EditorSelectionManipulator[]) => EditorSelectionManipulator[]) | undefined,
        fct: (sel: EditorSelectionManipulator, index: number) => EditorSelectionManipulator[]
    ) {
        let selections = EditorSelectionManipulator.listSelections(editor)

        if (arrayCallback){
            selections = arrayCallback(selections)
        }
        
        const newSelections: EditorRangeOrCaret[] = [];
        selections.forEach((sel, index) =>
            newSelections.push(...fct(new EditorSelectionManipulator(sel, editor), index).map(sel => sel.toEditorRangeOrCaret()))
        )
        if (newSelections.length > 0) editor.transaction({
            selections: newSelections
        })
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

    static surroundWithChars(editor: Editor, chars: string, endchars: string = chars) {
        SelectionsProcessing.selectionsProcessorTransaction(
            editor,
            sel => {
                const surroundSel = sel.clone().normalize().moveCharsWithoutOffset(-chars.length, endchars.length);
                if (surroundSel.getText().startsWith(chars) && surroundSel.getText().endsWith(endchars)) {
                    return {
                        replaceSelection: surroundSel,
                        replaceText: surroundSel.getText().substring(chars.length, surroundSel.getText().length - endchars.length),
                        finalSelection: sel.moveCharsWithoutOffset(-chars.length, sel.isOneLine() ? -chars.length : 0)
                    }
                }
                return {
                    replaceSelection: sel,
                    replaceText: chars+sel.getText()+endchars,
                    finalSelection: sel.clone().moveCharsWithoutOffset(chars.length,sel.isOneLine() ? chars.length : 0)
                }
            }
        )
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