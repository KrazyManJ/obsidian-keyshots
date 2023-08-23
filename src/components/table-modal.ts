import {App, Notice, Setting} from "obsidian";
import CallbackModal from "./abstract/callback-modal";

interface TableData {
    rows: number
    columns: number
}

export default class TableModal extends CallbackModal<TableData> {

    constructor(app: App, confirmCallback: (data: TableData) => void) {
        super(app, "Insert Table", confirmCallback);
    }

    onOpen() {
        super.onOpen()
        const { contentEl, containerEl } = this;
        containerEl.classList.add("keyshots-table-modal");

        contentEl.createEl("p", {
            "cls": "desc",
            "text": "Quick-select size in grid or write exact values and confirm them via button."
        });

        const divider = contentEl.createEl("div", "divider");
        const tableEl = divider.createEl("div", "table-selector-container");
        const matrix = tableEl.createEl("table");

        const processCellsInTable = (rN: number, cN: number, callback: (cell: HTMLTableCellElement, r: number, c: number) => void) => {
            Array.from(matrix.rows).slice(0, rN).forEach((row, i) => {
                Array.from(row.getElementsByTagName("td")).slice(0, cN).forEach((col, j) => callback(col, i, j))
            })
        }

        const geometryLabel = tableEl.createEl("div", "geometry-label")
        for (let i = 0; i < 10; i++) {
            const tr = matrix.createEl("tr");
            for (let j = 0; j < 10; j++) {
                const td = tr.createEl("td");
                if (j == 0) continue;
                td.addEventListener("click", () => {
                    this.successClose({
                        rows: i + 1,
                        columns: j + 1
                    });
                })
                td.addEventListener("mouseenter", () => {
                    processCellsInTable(i + 1, j + 1, (cell) => cell.classList.add("hovered"))
                    geometryLabel.textContent = `${i + 1}R x ${j + 1}C`
                });
                td.addEventListener("mouseleave", () => {
                    processCellsInTable(i + 1, j + 1, (cell) => cell.removeAttribute("class"))
                    geometryLabel.textContent = ``
                });
            }
        }
        const optEl = divider.createEl("div", {"cls": "opt"});
        const data = {
            row: 2,
            column: 2
        };
        new Setting(optEl)
            .setName("Rows")
            .setDesc("Does not include headings row.")
            .addText(cb => cb
                .setValue("2")
                .onChange(v => data.row = parseInt(v))
            );
        new Setting(optEl)
            .setName("Columns")
            .addText(cb => cb
                .setValue("2")
                .onChange(v => data.column = parseInt(v))
            );
        optEl.querySelectorAll("input[type=text]").forEach(e => e.setAttrs({
            "type": "number",
            "min": "2",
            "max": "200",
            "step": "1"
        }));
        new Setting(optEl)
            .addButton(cb => cb
                .setCta()
                .setButtonText("Insert table")
                .onClick(() => {
                    if (isNaN(data.row) || isNaN(data.column)) {
                        new Notice("⚠️ Error: Invalid input of row or column values!");
                        return;
                    }
                    this.successClose({
                        rows: Math.max(2, data.row),
                        columns: Math.max(2, data.column)
                    });
                })
            );
    }
}