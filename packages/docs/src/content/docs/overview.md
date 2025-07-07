# Overview of UI-Schema Design-Systems and Widgets

## Design Systems

The package `@ui-schema/ui-schema` supports rendering widgets for JSON-schema `type` or individual widgets.

It is possible to connect any design system, included or planned support:

| Package      | Based on            | Status |
| :---         | :---                 | ---: |
| `@ui-schema/ds-material`  | [@mui/material (MUI)](https://material-ui.com/) to use [Material Design](https://material.io/) | ✅ |
| `@ui-schema/ds-bootstrap` | [bootstrap (BTS)](https://getbootstrap.com/) semantic HTMLs to use with any Bootstrap theme | ✅ |
| `@ui-schema/ds-blueprint` | [blueprintjs (BPT)](https://blueprintjs.com/docs/) | 🔵 |
| `@ui-schema/ds-semanticui` | [semantic-ui (SUI)](https://react.semantic-ui.com/usage/) | 🔵 |
| `@ui-schema/ds-antdesign` | [Ant Design (ATD)](https://ant.design/docs/react/introduce) | 🔵 |
| `@ui-schema/ds-themeui` | [Theme UI (TUI)](https://theme-ui.com) | 🔵 |

📚 [Quick-Start](/quick-start), [Details about Design Systems](/docs/design-systems)

A design-system bundles multiple widgets, select the design-system binding you need.

Each widget handles it's own sub-schema, e.g. the `string` type widget only needs to know how to handle it's own string.

A match by `widget` supersedes the `type` matching, this is a simple example of a widget binding, the property name in `types` and `custom` is used for matching:

```js
import {StringRenderer, OptionsCheck} from "@ui-schema/ds-material";

const widgets = {
    types: {
        string: StringRenderer,
    },
    custom: {
        OptionsCheck: OptionsCheck,
    },
};
```

This schema renders the `StringRenderer` widget:

```json
{
    "type": "string"
}
```

This schema renders the `OptionsCheck` widget:

```json
{
    "type": "object",
    "widget": "OptionsCheck"
}
```

## Widget List

Here is an overview of all widgets/types, the first column contains the default matching name.

Widgets for `type`:

| Type         | Component            | MUI | BTS | ? |
| :---         | :---                 | ---: | ---: | ---: |
| `string`     | [Normal Text + Formats](/docs/widgets/TextField)<br>`*`, `date`, `email`, `tel` | ✅ | ✅ | 🔵 |
| `number`, `integer`     | [Number](/docs/widgets/TextField)     | ✅ | ✅ | 🔵 |
| `boolean`    | [Switch / Toggle](/docs/widgets/Switch) | ✅ | ✅ | 🔵 |
| `object`, `*` | [Native Objects / Grid](/docs/widgets/GridHandler) | ✅ | ✅ | 🔵 |
| `array`      | only supported through widgets | - | - | - |

Custom widgets for `widget`, special UIs and specific type handling:

| Widget                        | Component                                                                            | Types                                                        | MUI | BTS |   ? |
|:------------------------------|:-------------------------------------------------------------------------------------|:-------------------------------------------------------------|:---:|:---:|----:|
| `Text`                        | [multiline text](/docs/widgets/TextField)                                            | `string`                                                     |  ✅  |  ✅  |  🔵 |
| `NumberSlider`                | [slider as input](/docs/widgets/NumberSlider)                                        | `number`<br>`array(number)`<br>`integer`<br>`array(integer)` |  ✅  | 🔵  |  🔵 |
| `Date`                        | [date selector](/docs/material-pickers/Overview)                                       | `string`                                                     |  ✅  | 🔵  |  🔵 |
| `DateTime`                    | [date and time selector](/docs/material-pickers/Overview)                              | `string`                                                     |  ✅  | 🔵  |  🔵 |
| `Time`                        | [time selector](/docs/material-pickers/Overview)                                       | `string`                                                     |  ✅  | 🔵  |  🔵 |
| `Color`                       | [color selector](/docs/widgets/Color)                                                | `string`                                                     |  ✅  | 🔵  |  🔵 |
| `StringIcon`                  | [input + icon, normal text](/docs/widgets/TextField)                                 | `string`                                                     |  ✅  | 🔵  |  🔵 |
| `TextIcon`                    | [input + icon, multiline text](/docs/widgets/TextField)                              | `string`                                                     |  ✅  | 🔵  |  🔵 |
| `NumberIcon`                  | [input + icon, number](/docs/widgets/TextField)                                      | `number`                                                     |  ✅  | 🔵  |  🔵 |
| `BoolIcon`                    |                                                                                      |                                                              | 🔵  | 🔵  |  🔵 |
|                               |                                                                                      |                                                              |     |     |     |
| **Rich-Text**                 |                                                                                      |                                                              |     |     |     |
| `Code`, `CodeSelectable`      | [text editor with syntax highlight](/docs/material-code/material-code)                              | `string`, `array(string, string)`, `object`                   |  ✅  | 🔵  |  🔵 |
|                               |                                                                                      |                                                              |     |     |     |
| **Lists**                     |                                                                                      |                                                              |     |     |     |
| `SimpleList`                  | [strings and numbers as list](/docs/widgets/SimpleList)                              | `array(string)`<br>`array(number)`                           |  ✅  | 🔵  |  🔵 |
| `GenericList`                 | [objects/array as list](/docs/widgets/SimpleList)                                    | `array({*})`, `array([*])`                                   |  ✅  | 🔵  |  🔵 |
|                               |                                                                                      |                                                              |     |     |     |
| **Selection**                 |                                                                                      |                                                              |     |     |     |
| `OptionsCheck`                | [checkboxes](/docs/widgets/OptionsList)                                              | `array`                                                      |  ✅  |  ✅  |  🔵 |
| `OptionsRadio`                | [radio buttons](/docs/widgets/OptionsList)                                           | `string`                                                     |  ✅  |  ✅  |  🔵 |
| `Select`                      | [select one value](/docs/widgets/Select)                                             | `string`                                                     |  ✅  |  ✅  |  🔵 |
| `SelectMulti`                 | [select n values](/docs/widgets/Select)                                              | `array`                                                      |  ✅  |  ✅  |  🔵 |
| `SelectGroup`                 |                                                                                      |                                                              | 🔵  | 🔵  |  🔵 |
|                               |                                                                                      |                                                              |     |     |     |
| **Media**                     |                                                                                      |                                                              |     |     |     |
| `File`                        | single file selector                                                                 |                                                              | 🔵  | 🔵  |  🔵 |
| `Files`                       | multiple files selector                                                              |                                                              | 🔵  | 🔵  |  🔵 |
| `Folder`                      | single folder selector                                                               |                                                              | 🔵  | 🔵  |  🔵 |
| `Folders`                     | multiple folder selector                                                             |                                                              | 🔵  | 🔵  |  🔵 |
| `MediaImage`                  | image selector, may support externals (like from youtube)                            |                                                              | 🔵  | 🔵  |  🔵 |
| `MediaVideo`                  | video selector, may support externals                                                |                                                              | 🔵  | 🔵  |  🔵 |
| `MediaAudio`                  | audio selector, may support externals                                                |                                                              | 🔵  | 🔵  |  🔵 |
| `MediaGallery`                | Media files selector, may support externals                                          |                                                              | 🔵  | 🔵  |  🔵 |
|                               |                                                                                      |                                                              |     |     |     |
| **Misc**                      |                                                                                      |                                                              |     |     |     |
| `Table`                       | [table editor](/docs/widgets/Table)                                                  |                                                              | ✅ℹ️ | 🔵  |  🔵 |
| `Drag 'n Drop` as Grid & List | [material-dnd widgets](/docs/material-dnd/overview)                                  |                                                              | ✅ℹ️ | 🔵  |  🔵 |
| `Accordions`                  | [accordion drop-downs](/docs/widgets/Accordions) for object properties with headline | `object`                                                     |  ✅  | 🔵  |  🔵 |
| `Card`                        | [card with headline for object root and any sub-schema](/docs/widgets/Card)          | `object`                                                     |  ✅  | 🔵  |  🔵 |
| `LabelBox`                    | box with label for object root and any sub-schema, without any styling               | `object`                                                     |  ✅  | 🔵  |  🔵 |
| `FormGroup`                   | form group (fieldset) with label                                                     | `object`                                                     |  ✅  | 🔵  |  🔵 |
| `ExpansionPanel`              | list headlines and sub-schema                                                        |                                                              | 🔵  | 🔵  |  🔵 |
| `Stepper`                     | list with [sub-schema as steps](/docs/widgets/Stepper)                               |                                                              | ✅ℹ️ | 🔵  |  🔵 |
| `Tabs`                        | list with sub-schema as tabs                                                         |                                                              | 🔵  | 🔵  |  🔵 |
| `Dialog`                      | sub-schema as dialog                                                                 |                                                              | 🔵  | 🔵  |  🔵 |
| `TransferList`                | double select list                                                                   |                                                              | 🔵  | 🔵  |  🔵 |
| `LocationSelect`              | location/geo selection                                                               |                                                              | 🔵  | 🔵  |  🔵 |
| `Price`                       |                                                                                      |                                                              | 🔵  | 🔵  |  🔵 |
| `NumberButton`                |                                                                                      |                                                              | 🔵  | 🔵  |  🔵 |

ℹ️= partly/work-in-progress

... more to follow

📚 [more on providing/overriding Widgets](/docs/widgets)
