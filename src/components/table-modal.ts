import {ButtonComponent, Setting} from "obsidian";
import CallbackModal from "./abstract/callback-modal";
import KeyshotsPlugin from "../plugin";

interface TableData {
    rows: number
    columns: number
}

export default class TableModal extends CallbackModal<TableData> {

    private rows: number
    private columns: number

    private actionButton: ButtonComponent

    constructor(plugin: KeyshotsPlugin, confirmCallback: (data: TableData) => void) {
        super(plugin, "Insert Table", confirmCallback);
        this.rows = this.plugin.settings.modal_table_last_used_rows;
        this.columns = this.plugin.settings.modal_table_last_used_columns;
    }

    private hasValidValues() {
        return !(isNaN(this.rows) || isNaN(this.columns))
            && this.columns >= 2
            && this.rows >= 1
    }

    private updateState() {
        this.actionButton.setDisabled(!this.hasValidValues());
    }

    onOpen() {
        super.onOpen()
        const {contentEl, containerEl} = this;
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
        new Setting(optEl)
            .setName("Rows")
            .setDesc("Does not include headings row.")
            .addText(cb => cb
                .setValue(this.rows.toString())
                .onChange(v => {
                    this.rows = parseInt(v);
                    if (!isNaN(this.rows))
                        this.plugin.setSetting("modal_table_last_used_rows", this.rows);
                    this.updateState();
                })
            );
        new Setting(optEl)
            .setName("Columns")
            .addText(cb => cb
                .setValue(this.columns.toString())
                .onChange(v => {
                    this.columns = parseInt(v);
                    if (!isNaN(this.columns))
                        this.plugin.setSetting("modal_table_last_used_columns", this.columns);
                    this.updateState();
                })
            );
        optEl.querySelectorAll("input[type=text]").forEach(e => e.setAttrs({
            "type": "number",
            "min": "2",
            "max": "200",
            "step": "1"
        }));
        new Setting(optEl)
            .addButton(cb => this.actionButton = cb
                .setCta()
                .setButtonText("Insert table")
                .onClick(() => {
                    this.successClose({
                        rows: this.rows,
                        columns: this.columns
                    });
                })
            );
        this.updateState();
    }
}