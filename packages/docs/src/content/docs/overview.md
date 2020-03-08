# Overview

## Design Systems

The package `@ui-schema/ui-schema` supports rendering widgets for JSON-schema `type` and individual widgets for any type.

It is possible to connect any design system, included or planned support:

- `@ui-schema/ds-material` binding for [@material-ui/core (MUI)](https://material-ui.com/) to use [Material Design](https://material.io/) - **in dev**
- `@ui-schema/ds-bootstrap` binding for plain [bootstrap (BTS)](https://getbootstrap.com/) semantic HTMLs to use with any Bootstrap theme - **in dev**
- `@ui-schema/ds-blueprint` binding for [blueprintjs (BPT)](https://blueprintjs.com/docs/) - **would be nice**
- `@ui-schema/ds-semanticui` binding for [semantic-ui (SUI)](https://react.semantic-ui.com/usage/) - **would be nice**
- `@ui-schema/ds-antdesign` binding for [Ant Design (ATD)](https://ant.design/docs/react/introduce) - **would be nice**
- `@ui-schema/ds-pulse` binding for [.pulse (PLS)](https://pulse.heartbeat.ua/components/box) - **would be nice**

📚 [Quick-Start](/quick-start), [Details about Design Systems](/docs/design-systems)

A design-system bundles multiple widgets, select the design-system binding you need.

Each widget handles it's own sub-schema, e.g. the `string` type widget only needs to know how to handle it's own string. [Super simple text widget example](/docs/core/#simplest-text-widget)

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
| `number`     | [Number](/docs/widgets/TextField)     | ✅ | ✅ | 🔵 |
| `boolean`    | [Switch / Toggle](/docs/widgets/Switch) | ✅ | ✅ | 🔵 |
| `object`, `*` | [Native Objects / Grid](/docs/widgets/GridHandler) | ✅ | ✅ | 🔵 |
| `array`      | only supported through widgets | - | - | - |

Custom widgets for `widget`, special UIs and specific type handling:

| Widget       | Component | Types | MUI | BTS | ? |
| :---         | :----     | :----     | :---: | :---: | ---: |
| `Text`       | [multiline text](/docs/widgets/TextField) | `string` | ✅ | ✅ | 🔵 |
| `NumberSlider` | [slider as input](/docs/widgets/NumberSlider) | `number`<br>`array(number)` | ✅ | 🔵 | 🔵 |
| `Date`       | [date selector](/docs/widgets/DateTimePickers) | `string` | ✅ | 🔵 | 🔵 |
| `DateTime`   | [date and time selector](/docs/widgets/DateTimePickers) | `string` | ✅ | 🔵 | 🔵 |
| `Time`       | [time selector)](/docs/widgets/DateTimePickers) | `string` | ✅ | 🔵 | 🔵 |
| `Color`      | [color selector](/docs/widgets/Color) | `string` | ✅ | 🔵 | 🔵 |
| `StringIcon` | [input + icon, normal text](/docs/widgets/TextField) | `string` | ✅ | 🔵 | 🔵 |
| `TextIcon`   | [input + icon, multiline text](/docs/widgets/TextField) | `string` | ✅ | 🔵 | 🔵 |
| `NumberIcon` | [input + icon, number](/docs/widgets/TextField) | `number` | ✅ | 🔵 | 🔵 |
| `BoolIcon`   |    | | 🔵 | 🔵 | 🔵 |
| | | | | | |
| **Rich-Text** | | | | | |
| `RichText`   | [multiline rich text editor](/docs/widgets/RichText) | `string` | ✅ | 🔵 | 🔵 |
| `RichTextInline` | [single-line rich text editor](/docs/widgets/RichText) | `string` | ✅ | 🔵 | 🔵 |
| `Code`       | [text editor with syntax highlight](/docs/widgets/Code) | `string` | ✅ | 🔵 | 🔵 |
| | | | | | |
| **Lists** | | | | | |
| `SimpleList` | [strings and numbers as list](/docs/widgets/SimpleList) | `array(string)`<br>`array(number)` | ✅ | 🔵 | 🔵 |
| `GenericList` | [objects/array as list](/docs/widgets/SimpleList) | `array({*})` | ✅ | 🔵 | 🔵 |
| | | | | | |
| **Selection** | | | | | |
| `OptionsCheck` | [checkboxes](/docs/widgets/OptionsList)  | `array` | ✅ | 🔵 | 🔵 |
| `OptionsRadio` | [radio buttons](/docs/widgets/OptionsList) | `string` | ✅ | 🔵 | 🔵 |
| `Select`     | [select one value](/docs/widgets/Select) | `string` | ✅ | 🔵 | 🔵 |
| `SelectMulti`  | [select n values](/docs/widgets/Select) | `array` | ✅ | 🔵 | 🔵 |
| `SelectGroup`  |    | | 🔵 | 🔵 | 🔵 |
| | | | | | |
| **Media** | | | | | |
| `File`       | single file selector   | | 🔵 | 🔵 | 🔵 |
| `Files`      | multiple files selector  | | 🔵 | 🔵 | 🔵 |
| `Folder`     | single folder selector | | 🔵 | 🔵 | 🔵 |
| `Folders`    | multiple folder selector  |  | 🔵 | 🔵 | 🔵 |
| `MediaImage` | image selector, may support externals (like from youtube) | | 🔵 | 🔵 | 🔵 |
| `MediaVideo` | video selector, may support externals | | 🔵 | 🔵 | 🔵 |
| `MediaAudio` | audio selector, may support externals | | 🔵 | 🔵 | 🔵 |
| `MediaGallery` | Media files selector, may support externals | | 🔵 | 🔵 | 🔵 |
| | | | | | |
| **Misc** | | | | | |
| `Table`      | table editor  | | 🔵 | 🔵 | 🔵 |
| `Grid`       | drag-drop grid  | | 🔵 | 🔵 | 🔵 |
| `Card` | card with headline and any sub-schema  | | 🔵 | 🔵 | 🔵 |
| `ExpansionPanel` | list headlines and sub-schema  | | 🔵 | 🔵 | 🔵 |
| `Stepper`    | list with [sub-schema as steps](/docs/widgets/Stepper) | | ✅ | 🔵 | 🔵 |
| `Tabs`       | list with sub-schema as tabs | | 🔵 | 🔵 | 🔵 |
| `Dialog`     | sub-schema as dialog | | 🔵 | 🔵 | 🔵 |
| `TransferList` | double select list | | 🔵 | 🔵 | 🔵 |
| `LocationSelect` | location/geo selection | | 🔵 | 🔵 | 🔵 |
| `Price` | | | 🔵 | 🔵 | 🔵 |
| `NumberButton` | | | 🔵 | 🔵 | 🔵 |

... more to follow

✅ only means some working example is existing during the current dev-state.

📚 [more on providing/overriding Widgets](/docs/widgets)
