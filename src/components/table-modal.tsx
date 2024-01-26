import {ButtonComponent, Setting} from "obsidian";
import CallbackModal from "./abstract/callback-modal";
import KeyshotsPlugin from "../plugin";
import {createRoot, Root} from "react-dom/client";
import * as React from "react";
import {useState} from "react";
import Repeater from "./react/Repeater";

interface TableData {
    rows: number
    columns: number
}

export default class TableModal extends CallbackModal<TableData> {

    private rows: number
    private columns: number
    private root: Root | null = null;

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

    private TablePicker = () => {
        const [hoverPos, setHoverPos] = useState<TableData>({rows: 0, columns: 0})

        const isHover = () => hoverPos.rows > 0 && hoverPos.columns > 0;

        return <>
            <table>
                <tbody>
                <Repeater times={10} elem={
                    (i) => <tr key={i}>
                        <Repeater times={10} elem={(j) =>
                            <td
                                key={j}
                                className={i < hoverPos.rows && j < hoverPos.columns ? "hovered" : "nope"}
                                onClick={j != 0 ? () => this.successClose({rows: i + 1, columns: j + 1}) : undefined}
                                onMouseEnter={() => setHoverPos({rows: i + 1, columns: j + 1})}
                                onMouseOut={() => setHoverPos({rows: 0, columns: 0})}
                            />
                        }/>
                    </tr>
                }/>
                </tbody>
            </table>
            <div className="geometry-label">{isHover() && `${hoverPos.rows}R x ${hoverPos.columns}C`}</div>
        </>
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
        const table = divider.createEl("div", "table-selector-container")
        this.root = createRoot(table);
        this.root.render(<this.TablePicker/>)
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

    onClose() {
        this.root?.unmount();
    }
}