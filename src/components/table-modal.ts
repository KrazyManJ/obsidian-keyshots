import {App, Editor, Modal, Notice, Setting} from "obsidian";
import {insertTable} from "../functions";


const processCellsInTable = (table: HTMLTableElement, rN: number, cN: number, callback: (cell: HTMLTableCellElement, r: number, c: number) => void) => {
    Array.from(table.rows).slice(0, rN).forEach((row, i) => {
        Array.from(row.getElementsByTagName("td")).slice(0, cN).forEach((col, j) => callback(col, i, j))
    })
}


export default class TableModal extends Modal {

    private readonly editor: Editor

    constructor(app: App, editor: Editor) {
        super(app);
        this.editor = editor;
    }

    onOpen() {
        const {contentEl} = this;
        this.titleEl.createEl("h1", {"text": "Insert Table"})
        this.containerEl.classList.add("keyshots-table-modal")

        contentEl.createEl("p",{
            "cls": "desc",
            "text": "Quick-select size in grid or write exact values on other side of control."
        })

        const divider = contentEl.createEl("div", "divider")
        const tableEl = divider.createEl("div", "table-selector-container")

        const matrix = tableEl.createEl("table");
        const geometryLabel = tableEl.createEl("div", "geometry-label")
        for (let i = 0; i < 10; i++) {
            const tr = matrix.createEl("tr")
            for (let j = 0; j < 10; j++) {
                const td = tr.createEl("td")
                if (j == 0) continue;
                td.addEventListener("click", () => {
                    this.close()
                    insertTable(this.editor, i+1, j+1)
                    this.editor.focus()
                })
                td.addEventListener("mouseenter", () => {
                    processCellsInTable(matrix, i+1, j+1, (cell) => cell.classList.add("hovered"))
                    geometryLabel.textContent = `${i+1}R x ${j+1}C`
                })
                td.addEventListener("mouseleave", () => {
                    processCellsInTable(matrix, i+1, j+1, (cell) => cell.removeAttribute("class"))
                    geometryLabel.textContent = ``
                })
            }
        }
        const optEl = divider.createEl("div",{"cls":"opt"})
        const data = {
            row: 2,
            column: 2
        }
        new Setting(optEl)
            .setName("Rows")
            .setDesc("Does not include headings row.")
            .addText(cb => cb
                .setValue("2")
                .onChange(v => data.row = parseInt(v))
            )
        new Setting(optEl)
            .setName("Columns")
            .addText(cb => cb
                .setValue("2")
                .onChange(v => data.column = parseInt(v))
            )
        optEl.querySelectorAll("input[type=text]").forEach(e => e.setAttrs({
            "type": "number",
            "min": "2",
            "max": "200",
            "step": "1"
        }))
        new Setting(optEl)
            .addButton(cb => cb
                .setCta()
                .setButtonText("Insert table")
                .onClick(() => {
                    if (isNaN(data.row) || isNaN(data.column)){
                        new Notice("⚠️ Error: Invalid input of row or column values!")
                        return;
                    }
                    this.close();
                    insertTable(this.editor, Math.max(2,data.row), Math.max(2,data.column))
                    this.editor.focus()
                })
            )
    }

    onClose() {
        this.containerEl.empty();
    }
}