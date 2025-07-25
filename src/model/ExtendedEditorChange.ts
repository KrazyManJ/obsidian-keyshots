import EditorSelectionManipulator from "src/classes/EditorSelectionManipulator"

/**
 * Variant of EditorChange for Keyshots SelectionProcessing class.
 */
export default interface ExtendedEditorChange {
    /**
     * Selection for replacing text
     */
    replaceSelection?: EditorSelectionManipulator
    /**
     * Text to replace
     */
    replaceText?: string
    /**
     * Selection that will appear after command (or after replacing was done)
     */
    finalSelection?: EditorSelectionManipulator
}