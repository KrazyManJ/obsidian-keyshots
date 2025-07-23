import SelectionsProcessing from "src/classes/SelectionsProcessing"
import KeyshotsCommand from "src/model/KeyshotsCommand"

export const indent: KeyshotsCommand = {
    id: 'indent',
    name: "Indent",
    editorCallback: (editor) => {
        const useTabs = app.vault.getConfig("useTabs")

        SelectionsProcessing.selectionsProcessor(editor, undefined, sel => {
            const expandedSelection = sel.clone().normalize().expand();
            if (sel.isCaret()) {
                expandedSelection.replaceText((useTabs ?? false ? '\t' : '    ')+expandedSelection.getText());
                return sel.moveChars(useTabs ?? false ? 1 : 4);
            }
            
            expandedSelection.replaceText(expandedSelection.getText().split("\n").map(line => {
                return (useTabs ?? false ? '\t' : '    ')+line
            }).join("\n"))
            return sel.expand()
        })
    }
}


export const unindent: KeyshotsCommand = {
    id: 'unindent',
    name: "Unindent",
    editorCallback: (editor) => {
        const useTabs = app.vault.getConfig("useTabs")

        const unindentLine = (line: string) => {
            if (useTabs && line.startsWith("\t")) return line.substring(1)
            else if (!useTabs && line.startsWith("    ")) return line.substring(4)
            return line
        }

        SelectionsProcessing.selectionsProcessor(editor, undefined, sel => {
            const expandedSelection = sel.clone().normalize().expand();
            if (sel.isCaret()) {
                expandedSelection.replaceText(unindentLine(expandedSelection.getText()));
                return sel.moveChars(useTabs ?? false ? -1 : -4);
            }
            expandedSelection.replaceText(expandedSelection.getText().split("\n").map(line => unindentLine(line)).join("\n"))
            return sel.expand()
        })
    }
}