<a href="https://github.com/KrazyManJ/obsidian-keyshots">
    <img src="assets/readme_banner.svg" alt="" width="100%">
</a>

Keyshots is an [Obsidian](https://obsidian.md) plugin that adds classic hotkey/shortcuts commands from popular IDEs like
Visual Studio Code or JetBrains Family.

## 🌠 Visual examples

Keyshots adds actions like move line up or down...

![](assets/gifs/line_move.gif)

...add caret cursor up or down...

![](assets/gifs/add_caret.gif)

...insert lines above or below...

![](assets/gifs/insert_line.gif)

...duplicate line up or down...

![](assets/gifs/vscode_duplicate_line.gif)

...duplicate text or selection...

![](assets/gifs/jetbrains_duplicate.gif)

...toggle readable line length inside editor...

![](assets/gifs/toggle_readable_line_length.gif)

...toggle line numbers inside editor...

![](assets/gifs/toggle_line_numbers.gif)

...encode or decode URI text...

![](assets/gifs/uri_encode_decode.gif)

...transform selected texts to lowercase, uppercase or titlecase...

![](assets/gifs/transform_text.gif)

...join selected lines to one line...

![](assets/gifs/join_lines.gif)

...split selections on new line and trim selection...

![](assets/gifs/split_sel_on_line_and_trim.gif)

...sort selected lines with alphanumeric comparison...

![](assets/gifs/sort_selected_lines.gif)

...transform selections to or from snakecase...

![](assets/gifs/transform_to_from_snakecase.gif)

...**and much more commands to explore!**  *(And more are comming soon)*

## ⌨️ List of Keyshots commands with IDE Mappings

Here is a full list of all mappings that are available. If any of hotkey for IDE action is missing, Keyshots mappings
hotkey is used instead *(This behavior can be changed in settings)*.

| Command Name                                   | Keyshots Mappings                 | Visual Studio Code              | JetBrains IDEs                    | Microsoft Visual Studio     |
|------------------------------------------------|-----------------------------------|---------------------------------|-----------------------------------|-----------------------------|
| Add caret cursor down                          | <kbd>Ctrl + Alt + ↓</kbd>         | <kbd>Ctrl + Alt + ↓</kbd>       |                                   | <kbd>Shift + Alt + ↓</kbd>  |
| Add caret cursor up                            | <kbd>Ctrl + Alt + ↑</kbd>         | <kbd>Ctrl + Alt + ↑</kbd>       |                                   | <kbd>Shift + Alt + ↑</kbd>  |
| Duplicate line down                            | <kbd>Shift + Alt + ↓</kbd>        | <kbd>Shift + Alt + ↓</kbd>      |                                   |                             |
| Duplicate line or selection                    | <kbd>Ctrl + Alt + D</kbd>         |                                 | <kbd>Ctrl + D</kbd>               | <kbd>Ctrl + D</kbd>         |
| Duplicate line up                              | <kbd>Shift + Alt + ↑</kbd>        | <kbd>Shift + Alt + ↑</kbd>      |                                   |                             |
| Expand Line selections                         | <kbd>Alt + E</kbd>                | <kbd>Ctrl + L</kbd>             | <kbd>Ctrl + W</kbd>               | <kbd>Shift + Alt + =</kbd>  |
| Change Keyshots preset                         | <kbd>Ctrl + Shift + P</kbd>       |                                 |                                   |                             |
| Insert code block                              | <kbd>Ctrl + Shift + \`</kbd>      |                                 |                                   |                             |
| Insert line above                              | <kbd>Ctrl + Shift + Enter</kbd>   | <kbd>Ctrl + Shift + Enter</kbd> | <kbd>Ctrl + Alt + Enter</kbd>     | <kbd>Ctrl + Enter</kbd>     |
| Insert line below                              | <kbd>Shift + Enter</kbd>          | <kbd>Ctrl + Enter</kbd>         | <kbd>Shift + Enter</kbd>          | <kbd>Shift + Enter</kbd>    |
| Insert ordinal numbering                       | <kbd>Shift + Alt + N</kbd>        |                                 |                                   |                             |
| Join selected lines                            | <kbd>Ctrl + Shift + J</kbd>       | <kbd>Shift + J</kbd>            | <kbd>Ctrl + Shift + J</kbd>       |                             |
| Move line down                                 | <kbd>Alt + ↓</kbd>                | <kbd>Alt + ↓</kbd>              | <kbd>Shift + Alt + ↓</kbd>        | <kbd>Alt + ↓</kbd>          |
| Move line up                                   | <kbd>Alt + ↑</kbd>                | <kbd>Alt + ↑</kbd>              | <kbd>Shift + Alt + ↑</kbd>        | <kbd>Alt + ↑</kbd>          |
| Multi-toggle bold                              | <kbd>Ctrl + Shift + B</kbd>       |                                 |                                   |                             |
| Multi-toggle code                              | <kbd>Ctrl + Shift + C</kbd>       |                                 |                                   |                             |
| Multi-toggle comment                           | <kbd>Ctrl + Shift + /</kbd>       |                                 |                                   |                             |
| Multi-toggle highlight                         | <kbd>Ctrl + Shift + H</kbd>       |                                 |                                   |                             |
| Multi-toggle italic                            | <kbd>Ctrl + Shift + I</kbd>       |                                 |                                   |                             |
| Multi-toggle strikethrough                     | <kbd>Ctrl + Shift + M</kbd>       |                                 |                                   |                             |
| Open developer tools                           | <kbd>F12</kbd>                    |                                 |                                   |                             |
| Open Keyshots settings tab                     | <kbd>Ctrl + Alt + ,</kbd>         |                                 |                                   |                             |
| Select all word instances                      | <kbd>Ctrl + Shift + L</kbd>       | <kbd>Ctrl + Shift + L</kbd>     | <kbd>Ctrl + Shift + Alt + J</kbd> | <kbd>Shift + Alt + \`</kbd> |
| Select multiple word instances                 | <kbd>Ctrl + D</kbd>               | <kbd>Ctrl + D</kbd>             | <kbd>Alt + J</kbd>                | <kbd>Shift + Alt + .</kbd>  |
| Shuffle selected lines                         | <kbd>Ctrl + Shift + Alt + S</kbd> |                                 |                                   |                             |
| Sort selected lines                            | <kbd>Ctrl + Shift + S</kbd>       |                                 |                                   |                             |
| Split selections by lines                      | <kbd>Ctrl + Alt + L</kbd>         |                                 |                                   |                             |
| Split selections on new line                   | <kbd>Alt + S</kbd>                |                                 |                                   |                             |
| Switch 'inline title' setting                  | <kbd>Ctrl + Alt + T</kbd>         |                                 |                                   |                             |
| Switch 'line numbers' setting                  | <kbd>Ctrl + Alt + N</kbd>         |                                 |                                   |                             |
| Switch 'readable line length' setting          | <kbd>Ctrl + Alt + R</kbd>         |                                 |                                   |                             |
| Switch Keyshots case sensitivity               | <kbd>Ctrl + Alt + I</kbd>         |                                 |                                   |                             |
| Toggle case (JetBrains)                        | <kbd>Ctrl + Shift + U</kbd>       |                                 | <kbd>Ctrl + Shift + U</kbd>       |                             |
| Toggle keyboard input (\<kbd\>)                | <kbd>Ctrl + Shift + K</kbd>       |                                 |                                   |                             |
| Toggle selections kebabcase                    | <kbd>Alt + -</kbd>                |                                 |                                   |                             |
| Toggle selections snakecase                    | <kbd>Shift + Alt + -</kbd>        |                                 |                                   |                             |
| Toggle selections URI encoded/decoded string   | <kbd>Ctrl + Alt + U</kbd>         |                                 |                                   |                             |
| Toggle underline                               | <kbd>Alt + N</kbd>                |                                 |                                   |                             |
| Transform selections to lowercase              | <kbd>Alt + L</kbd>                |                                 |                                   | <kbd>Ctrl + U</kbd>         |
| Transform selections to titlecase (capitalize) | <kbd>Alt + C</kbd>                |                                 |                                   |                             |
| Transform selections to uppercase              | <kbd>Alt + U</kbd>                |                                 |                                   | <kbd>Ctrl + Shift + U</kbd> |
| Trim selections                                | <kbd>Alt + T</kbd>                |                                 |                                   |                             |

## ✌️⌨️ Double-Key commands

Double key commands are feature used in JetBrains IDEs, that are 
doing certain actions after specific key is pressed twice.

Now Keyshots has two double-key commands:

- <kbd>Ctrl</kbd> - Pressing and holding last key and then press <kbd>↑</kbd> or <kbd>↓</kbd> will
add caret cursor just like `Add caret cursor up` or `Add caret cursor down` do
- <kbd>Shift</kbd> - If you have internal plugin `Quick Switcher` enabled, then this shortcut will
open quick switcher window just like <kbd>Ctrl + O</kbd> does

If you do not like them, then you can disable them in settings.

## 🎛️ Settings

Adds ability to choose default hotkeys mappings by IDEs presets. You can also configure behavior of some commands.

You can choose from these IDEs presets:

- Clear (everything blank; set in default when keyshots are installed)
- Visual Studio Code
- JetBrains IDEs Family (IntelliJ IDEA, PyCharm, WebStorm, ... )
- Microsoft Visual Studio
- Keyshots default hotkeys mappings

You can change it also via modal window inside obsidian that you can
open with command "Change Keyshots preset" with <kbd>Ctrl + Shift + P</kbd> shortcut.

## ⚠️ Possible conflicts:

Some IDE commands have hotkey, that is already set to another Obsidian action and that results into conflict.

Here is list of all possible conflicts:

| Hotkey                        | Visual Studio Code     | JetBrains IDEs         | Microsoft Visual Studio | Obsidian Action                     |
|-------------------------------|------------------------|------------------------|-------------------------|-------------------------------------|
| <kbd>Ctrl + L</kbd>           | Expand line selections |                        |                         | Toggle checkbox status              |
| <kbd>Ctrl + Enter</kbd>       | Insert line below      |                        | Insert line above       | Open link under cursor in new tab   |
| <kbd>Ctrl + W</kbd>           |                        | Expand line selections |                         | Close current tab                   |
| <kbd>Ctrl + Alt + Enter</kbd> |                        | Insert line above      |                         | Open link under cursor to the right |

### My conflicts handling

For default Keyshots mappings I will take care of all conflicts with Obsidian hotkeys. However, mind that I can take care
of obsidian hotkeys only meaning that plugins hotkeys are irrelevant and impossible to handle due to unlimited plugin
amount.

Also, obsidian team recommends to don't set default hotkeys for commands and that is why Keyshots installs with "clear"
preset!
