<h1 align=center>Keyshots</h1>

<p align=center><i>Turn your Obsidian into compact text editor!</i></p>

---

Keyshots is an [Obsidian](https://obsidian.md) plugin that adds classic hotkey/shortcuts commands from popular IDEs like Visual Studio Code or JetBrains Family. 

Apart from that, i want to add as much my custom and usefull commands as possible!

Adds actions like move line up or down...

![](assets/line_move.gif)

...add caret cursor up or down...

![](assets/add_caret.gif)

...insert lines above or below...

![](assets/insert_line.gif)

...duplicate line up or down...

![](assets/vscode_duplicate_line.gif)

...duplicate text or selection...

![](assets/jetbrains_duplicate.gif)

...toggle readable line length inside editor...

![](assets/toggle_readable_line_length.gif)

...toggle line numbers inside editor...

![](assets/toggle_line_numbers.gif)

...encode or decode URI text...

![](assets/uri_encode_decode.gif)

...transform selected texts to Lowercase...

![](assets/transform_text.gif)

...join selected lines to one line...

![](assets/join_lines.gif)

...split selections on new line and trim selection...

![](assets/split_sel_on_line_and_trim.gif)

...sort selected lines with alphanumeric comparison...

![](assets/sort_selected_lines.gif)

...transform selections to or from snakecase...

![](assets/transform_to_from_snakecase.gif)

...**And more commands comming soon**!

## ⌨️ IDE Mappings

Here is a full list of all mappings that are available. If any of hotkey for IDE action is missing, Keyshots mappings hotkey is used instead.

| Command Name                             | Visual Studio Code              | JetBrains IDEs                    | Microsoft Visual Studio     | Keyshots Mappings                 |
| ---------------------------------------- | ------------------------------- | --------------------------------- | --------------------------- | --------------------------------- |
| Add carets down                          | <kbd>Ctrl + Alt + ↓</kbd>       |                                   | <kbd>Shift + Alt + ↓</kbd>  | <kbd>Ctrl + Alt + ↓</kbd>         |
| Add carets up                            | <kbd>Ctrl + Alt + ↑</kbd>       |                                   | <kbd>Shift + Alt + ↑</kbd>  | <kbd>Ctrl + Alt + ↑</kbd>         |
| Encode/Decode URI                        |                                 |                                   |                             | <kbd>Ctrl + Alt + U</kbd>         |
| Insert line below                        | <kbd>Ctrl + Enter</kbd>         | <kbd>Shift + Enter</kbd>          | <kbd>Shift + Enter</kbd>    | <kbd>Shift + Enter</kbd>          |
| Insert line above                        | <kbd>Ctrl + Shift + Enter</kbd> | <kbd>Ctrl + Alt + Enter</kbd>     | <kbd>Ctrl + Enter</kbd>     | <kbd>Ctrl + Shift + Enter</kbd>   |
| Join selected lines                      | <kbd>Shift + J</kbd>            | <kbd>Ctrl + Shift + J</kbd>       |                             | <kbd>Ctrl + Shift + J</kbd>       |
| Sort selected lines                      |                                 |                                   |                             | <kbd>Ctrl + Shift + S</kbd>       |
| Shuffle selected lines                   |                                 |                                   |                             | <kbd>Ctrl + Shift + Alt + S</kbd> |
| Split selections by lines                |                                 |                                   |                             | <kbd>Ctrl + Alt + L</kbd>         |
| Split selections on new line             |                                 |                                   |                             | <kbd>Alt + S</kbd>                |
| Select all word instances                | <kbd>Ctrl + Shift + L</kbd>     | <kbd>Ctrl + Shift + Alt + J</kbd> | <kbd>Shift + Alt + \`</kbd> | <kbd>Ctrl + Shift + L</kbd>       |
| Select multiple word instances           | <kbd>Ctrl + D</kbd>             | <kbd>Alt + J</kbd>                | <kbd>Shift + Alt + .</kbd>  | <kbd>Ctrl + D</kbd>               |
| Trim selections                          |                                 |                                   |                             | <kbd>Alt + T</kbd>                |
| Move line up                             | <kbd>Alt + ↑</kbd>              | <kbd>Shift + Alt + ↑</kbd>        | <kbd>Alt + ↑</kbd>          | <kbd>Alt + ↑</kbd>                |
| Move line down                           | <kbd>Alt + ↓</kbd>              | <kbd>Shift + Alt + ↓</kbd>        | <kbd>Alt + ↓</kbd>          | <kbd>Alt + ↓</kbd>                |
| Duplicate line up                        | <kbd>Shift + Alt + ↑</kbd>      |                                   |                             | <kbd>Shift + Alt + ↑</kbd>        |
| Duplicate line down                      | <kbd>Shift + Alt + ↓</kbd>      |                                   |                             | <kbd>Shift + Alt + ↓</kbd>        |
| Duplicate line or selection              |                                 | <kbd>Ctrl + D</kbd>               | <kbd>Ctrl + D</kbd>         | <kbd>Ctrl + Alt + D</kbd>         |
| Expand Line selections                   | <kbd>Ctrl + L</kbd>             | <kbd>Ctrl + W</kbd>               | <kbd>Shift + Alt + =</kbd>  | <kbd>Alt + E</kbd>                | 
| Toggle case                              |                                 | <kbd>Ctrl + Shift + U</kbd>       |                             | <kbd>Ctrl + Shift + U</kbd>       |
| Toggle readable line length              |                                 |                                   |                             | <kbd>Ctrl + Alt + R</kbd>         |
| Toggle line numbers                      |                                 |                                   |                             | <kbd>Ctrl + Alt + N</kbd>         |
| Toggle inline title                      |                                 |                                   |                             | <kbd>Ctrl + Alt + T</kbd>         |
| Toggle Keyshots case sensitivity         |                                 |                                   |                             | <kbd>Ctrl + Alt + I</kbd>         |
| Transform selections to Lowercase        |                                 |                                   | <kbd>Ctrl + U</kbd>         | <kbd>Alt + L</kbd>                |
| Transform selections to Uppercase        |                                 |                                   | <kbd>Ctrl + Shift + U</kbd> | <kbd>Alt + U</kbd>                |
| Transform selections to Titlecase        |                                 |                                   |                             | <kbd>Alt + C</kbd>                |
| Transform selections from / to Snakecase |                                 |                                   |                             | <kbd>Shift + Alt + -</kbd>        |
| Transform selections from / to Kebabcase |                                 |                                   |                             | <kbd>Alt + -</kbd>                |

## 🎛️ Settings

Adds ability to choose default hotkeys mappings by IDEs presets. You can also configure behavior of some commands.

You can choose from these IDEs presets:

- Clear (everything blank; set in default when keyshots are installed)
- Visual Studio Code
- JetBrains IDEs Family (IntelliJ IDEA, PyCharm, WebStorm, ... )
- Microsoft Visual Studio
- Keyshots default hotkeys mappings

## ⚠️ Possible conflicts:

Some IDE commands have hotkey, that is already set to another Obsidian action and that results into conflict.

Here is list of all possible conflicts:

| Hotkey                        | Visual Studio Code     | JetBrains IDEs         | Microsoft Visual Studio | Obsidian Action                     |
| ----------------------------- | ---------------------- | ---------------------- | ----------------------- | ----------------------------------- |
| <kbd>Ctrl + L</kbd>           | Expand line selections |                        |                         | Toggle checkbox status              |
| <kbd>Ctrl + Enter</kbd>       | Insert line below      |                        | Insert line above       | Open link under cursor in new tab   |
| <kbd>Ctrl + W</kbd>           |                        | Expand line selections |                         | Close current tab                   |
| <kbd>Ctrl + Alt + Enter</kbd> |                        | Insert line above      |                         | Open link under cursor to the right |

### My conflicts handling

For default Keyshots mappings I will take care of all conflicts with Obsidian hotkeys. However mind that I can take care of obsidian hotkeys only meaning that plugins hotkeys are irrelevant and impossible to handle due to unlimited plugin amount. 

Also obsidian team recommends to don't set default hotkeys for commands and that is why Keyshots installs with "clear" preset!
