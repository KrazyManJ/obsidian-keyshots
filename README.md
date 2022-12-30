<h1 align=center>Keyshots</h1>

<p align=center><i>Turn your Obsidian into compact text editor!</i></p>

---

Keyshots is an [Obsidian](https://obsidian.md) plugin that adds classic hotkey/shortcuts commands from popular IDEs like Visual Studio Code or JetBrains Family. 

Apart from that, i want to add as much my custom and usefull commands as possible!

Adds actions like...

...move line up or down (**Visual Studio Code**: <kbd>Alt + ↑</kbd> / <kbd>Alt + ↓</kbd>; **Jetbrains**: <kbd>Shift + Alt + ↑</kbd> / <kbd>Shift + Alt + ↓</kbd>) ...

![](assets/line_move.gif)

...add caret cursor up or down (<kbd>Ctrl + Alt + ↑</kbd> / <kbd>Ctrl + Alt + ↓</kbd>) ...

![](assets/add_caret.gif)

...insert lines above or below (<kbd>Shift + Enter</kbd> / <kbd>Ctrl + Shift + Enter</kbd>) ...

![](assets/insert_line.gif)

...duplicate line up or down (**Visual Studio Code duplication style**) (<kbd>Shift + Alt + ↑</kbd> / <kbd>Shift + Alt + ↓</kbd>) ...

![](assets/vscode_duplicate_line.gif)

...duplicate text or selection (**Jetbrains duplication style**) (<kbd>Ctrl + D</kbd>) ...

![](assets/jetbrains_duplicate.gif)

...toggle readable line length inside editor (<kbd>Ctrl + Shift + R</kbd>) ...

![](assets/toggle_readable_line_length.gif)

...toggle line numbers inside editor (<kbd>Ctrl + Shift + L</kbd>) ...

![](assets/toggle_line_numbers.gif)

...encode or decode URI text (<kbd>Ctrl + Alt + U</kbd>) ...

![](assets/uri_encode_decode.gif)

...transform selected texts to Lowercase (<kbd>Alt + L</kbd>) / Uppercase (<kbd>Alt + U</kbd>) / Titlecase (<kbd>Alt + C</kbd>) ...

![](assets/transform_text.gif)

...join selected lines to one line (<kbd>Crtl + Shift + J</kbd>) ...

![](assets/join_lines.gif)

...split selections on new line (<kbd>Alt + S</kbd>) and trim selection (<kbd>Alt + T</kbd>) ...

![](assets/split_sel_on_line_and_trim.gif)

...sort selected lines with alphanumeric comparison (<kbd>Ctrl + Shift + S</kbd>) ...

![](assets/sort_selected_lines.gif)

...transform selections to or from snakecase (<kbd>Alt + -</kbd>) ...

![](assets/transform_to_from_snakecase.gif)

...**And more commands comming soon**!

## 🎛️ Settings

Added in version 1.2.0, adds ability to choose default hotkeys mappings by IDEs presets.

Now you can choose from these IDEs:

- Clear (everything blank; set in default when keyshots are installed) (**NEW IN** 1.4.0)
- Visual Studio Code
- JetBrains IDEs Family (IntelliJ IDEA, PyCharm, WebStorm, ... )
- Microsoft Visual Studio (**NEW IN** 1.3.0)

## ⚠️ Read before usage:

- `Duplicate line or selection (JetBrains IDEs)` command is defaultly on the same hotkey as `delete line` command (<kbd>Ctrl + D</kbd>). That is because JetBrains IDEs have it the same way. Before usage change this action hotkey based on your preference or basically clear `Delete line` command!

- For most of these commands, it requires more than one undo/revert actions, because these commands contain more than one instruction.