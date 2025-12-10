<a href="https://github.com/KrazyManJ/obsidian-keyshots">
    <img src="assets/readme_banner.svg" alt="" width="100%">
</a>

<div align="center">

![Obsidian Plugin](https://img.shields.io/badge/Obsidian-Plugin-9A7DD2.svg?logo=obsidian&logoColor=white&labelColor=1e1e1e)
![Downloads](https://img.shields.io/badge/dynamic/json?color=8572db&labelColor=1e1e1e&label=Downloads&query=$['keyshots'].downloads&url=https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugin-stats.json)
![Release date](https://img.shields.io/github/v/release/krazymanj/obsidian-keyshots?labelColor=1e1e1e&label=Release)
![GitHub Release Date](https://img.shields.io/github/release-date/krazymanj/obsidian-keyshots?color=8572db&labelColor=1e1e1e&label=Latest%20Release)
![License](https://img.shields.io/github/license/krazymanj/obsidian-keyshots?labelColor=1e1e1e&label=License)
[![Build Status](https://img.shields.io/github/actions/workflow/status/krazymanj/obsidian-keyshots/release.yml?label=Release%20Build&labelColor=1e1e1e)](https://github.com/krazymanj/obsidian-keyshots/actions)

</div>

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

Here is a full list of all Keyshots commands with mappings of hotkeys that are available. If any of hotkey for IDE action is missing, Keyshots mappings
hotkey is used instead *(This behavior can be changed in settings)*.

| Hotkeys | Keyshots Default Mappings | Visual Studio Code | JetBrains IDEs | Microsoft Visual Studio |
| --- | --- | --- | --- | --- |
| `Duplicate line up (Visual Studio Code)` | <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>↑</kbd> | <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>↑</kbd> |  |  |
| `Duplicate line down (Visual Studio Code)` | <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>↓</kbd> | <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>↓</kbd> |  |  |
| `Duplicate selection or line (JetBrains IDEs)` | <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>D</kbd> |  | <kbd>Ctrl</kbd> + <kbd>D</kbd> | <kbd>Ctrl</kbd> + <kbd>D</kbd> |
| `Insert line above` | <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Enter</kbd> | <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Enter</kbd> | <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>Enter</kbd> | <kbd>Ctrl</kbd> + <kbd>Enter</kbd> |
| `Insert line below` | <kbd>Shift</kbd> + <kbd>Enter</kbd> | <kbd>Ctrl</kbd> + <kbd>Enter</kbd> | <kbd>Shift</kbd> + <kbd>Enter</kbd> | <kbd>Shift</kbd> + <kbd>Enter</kbd> |
| `Join selected lines` | <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>J</kbd> | <kbd>Ctrl</kbd> + <kbd>J</kbd> | <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>J</kbd> |  |
| `Move selected lines down` | <kbd>Alt</kbd> + <kbd>↓</kbd> | <kbd>Alt</kbd> + <kbd>↓</kbd> | <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>↓</kbd> | <kbd>Alt</kbd> + <kbd>↓</kbd> |
| `Move selected lines up` | <kbd>Alt</kbd> + <kbd>↑</kbd> | <kbd>Alt</kbd> + <kbd>↑</kbd> | <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>↑</kbd> | <kbd>Alt</kbd> + <kbd>↑</kbd> |
| `Reverse selected lines` | <kbd>Alt</kbd> + <kbd>R</kbd> |  |  |  |
| `Shuffle selected lines` | <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>S</kbd> |  |  |  |
| `Sort selected lines` | <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd> |  |  |  |
| `Indent` | <kbd>Alt</kbd> + <kbd>]</kbd> |  |  |  |
| `Unindent` | <kbd>Alt</kbd> + <kbd>[</kbd> |  |  |  |
| `Better insert callout` | <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>C</kbd> |  |  |  |
| `Insert code block` | <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>`</kbd> |  |  |  |
| `Insert ordinal numbering` | <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>N</kbd> |  |  |  |
| `Insert Table` | <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>T</kbd> |  |  |  |
| `Change Keyshots preset` | <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> |  |  |  |
| `Open Keyshots settings tab` | <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>,</kbd> |  |  |  |
| `Switch Keyshots case sensitivity` | <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>I</kbd> |  |  |  |
| `Switch 'inline title' setting` | <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>T</kbd> |  |  |  |
| `Switch 'line numbers' setting` | <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>N</kbd> |  |  |  |
| `Switch 'readable line length' setting` | <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>R</kbd> |  |  |  |
| `Reopen current note` | <kbd>Alt</kbd> + <kbd>Q</kbd> |  |  |  |
| `Open developer tools` | <kbd>F12</kbd> |  |  |  |
| `Toggle focus mode` | <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>F</kbd> |  |  |  |
| `Duplicate tab` | <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>D</kbd> |  |  |  |
| `Close all foldable callouts` | <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>L</kbd> |  |  |  |
| `Open all foldable callouts` | <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>O</kbd> |  |  |  |
| `Toggle all callouts fold state` | <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>K</kbd> |  |  |  |
| `Toggle case (JetBrains)` | <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>U</kbd> |  | <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>U</kbd> |  |
| `Transform selections to lowercase` | <kbd>Alt</kbd> + <kbd>U</kbd> |  |  | <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>U</kbd> |
| `Replace by Regular Expression (Regex)` | <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>H</kbd> |  |  |  |
| `Toggle selections kebabcase` | <kbd>Alt</kbd> + <kbd>-</kbd> |  |  |  |
| `Toggle keyboard input (<kbd>)` | <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>K</kbd> |  |  |  |
| `Toggle selections snakecase` | <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>-</kbd> |  |  |  |
| `Toggle underline` | <kbd>Alt</kbd> + <kbd>N</kbd> |  |  |  |
| `Toggle selections URI encoded/decoded string` | <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>U</kbd> |  |  |  |
| `Transform selections to titlecase (capitalize)` | <kbd>Alt</kbd> + <kbd>C</kbd> |  |  |  |
| `Trim selections` | <kbd>Alt</kbd> + <kbd>T</kbd> |  |  |  |
| `Add caret cursor down` | <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>↓</kbd> | <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>↓</kbd> |  | <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>↓</kbd> |
| `Add caret cursor up` | <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>↑</kbd> | <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>↑</kbd> |  | <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>↑</kbd> |
| `Select all word instances` | <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>L</kbd> | <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>L</kbd> | <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>J</kbd> | <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>;</kbd> |
| `Select multiple word instances` | <kbd>Ctrl</kbd> + <kbd>D</kbd> | <kbd>Ctrl</kbd> + <kbd>D</kbd> | <kbd>Alt</kbd> + <kbd>J</kbd> | <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>.</kbd> |
| `Search by Regular Expression (Regex)` | <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>S</kbd> |  |  |  |
| `Split selections by lines` | <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>L</kbd> |  |  |  |
| `Expand line selections` | <kbd>Alt</kbd> + <kbd>E</kbd> | <kbd>Ctrl</kbd> + <kbd>L</kbd> | <kbd>Ctrl</kbd> + <kbd>W</kbd> | <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>=</kbd> |
| `Split selections on new line` | <kbd>Alt</kbd> + <kbd>S</kbd> |  |  |  |
| `Go to next fold` | <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>]</kbd> |  |  |  |
| `Go to previous fold` | <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>[</kbd> |  |  |  |
| `Go to parent fold` | <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>P</kbd> |  |  |  |

## ✌️⌨️ Double-Key commands

Double key commands are feature used in JetBrains IDEs, that are 
doing certain actions after specific key is pressed twice.

Now Keyshots has two double-key commands:

- Pressing and holding last key and then press <kbd>↑</kbd> or <kbd>↓</kbd> will
add caret cursor just like `Add caret cursor up` or `Add caret cursor down` do
- If you have internal plugin `Quick Switcher` enabled, then this shortcut will
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