# TextField

Widgets for native HTML text inputs, usable for `string` (single/multiline), `number` types and browser supported formats.

[![Component Examples](https://img.shields.io/badge/Examples-green?labelColor=1d3d39&color=1a6754&logoColor=ffffff&style=flat-square)](#demo-ui-generator) [![supports Material-UI Binding](https://img.shields.io/badge/Material-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=mui)](#material-ui) [![supports Bootstrap Binding](https://img.shields.io/badge/Bootstrap-green?labelColor=3C2B57&color=563D7C&logoColor=ffffff&style=flat-square&logo=bootstrap)](#bootstrap)

- type: `string`, `number`, `integer`
    - widgets for `number` and `integer` only accept valid numerals (and `.,-`) for better UX, handling `,` vs. `.` automatically for floats
- formats:
    - `date`
    - `email`
    - `tel`, must also be validated with `pattern`, as there is no tel-format worldwide specified
- widget keywords:
    - `Text` for multi-line text
    - `StringIcon` for single-line text with icon
    - `TextIcon` for multi-line text with icon
    - `NumberIcon` for number input with icon
- schema keywords
    - [Type Keywords](/docs/schema#type-string)
    - [View Keywords](/docs/schema#view-keyword)

## Design System

### Material-UI

```js
import {
    TextRenderer, NumberRenderer, StringRenderer
} from "@ui-schema/ds-material/Widgets/TextField";
import {
    TextIconRenderer, NumberIconRenderer, StringIconRenderer
} from "@ui-schema/ds-material/Widgets/TextFieldIcon";

const widgets = {
    types: {
        string: StringRenderer,
        number: NumberRenderer,
    },
    custom: {
        Text: TextRenderer,
        StringIcon: StringIconRenderer,
        TextIcon: TextIconRenderer,
        NumberIcon: NumberIconRenderer,
    },
};
```

**Supports extra keywords:**

- `view`
    - `variant`
    - `margin`
    - `dense` if `true` applies size `small`
    - `shrink` to `true` to always have the label up, e.g. native-date may look wrong otherwise in some browsers (use @ui-schema/material-pickers for best date/time support)
- `formats`
    - supports browser based translations for format mismatch, schema key: `t: 'browser''` (will be moved to another way)
- `info`
    - supported by all except the `*Icon` widgets, to render the [InfoRenderer](/docs/ds-material/Component/InfoRenderer)

**Widgets:**

- `TextRenderer` supports multi-line text
    - extra keywords:
        - `view`
            - `rows` minimum rows visible
            - `rowsMax` maximum rows visible
            - if both are set, the `textarea` grows until `rowsMax` is reached
            - `hideTitle` does not show the title, but will use it as aria-label
    - `TextIconRenderer` supports an icon additionally
    - `TextRendererDebounced` uses a debounced internal state
- `NumberRenderer` supports `number`, `integer`
    - `NumberIconRenderer` supports an icon additionally
    - `NumberRendererDebounced` uses a debounced internal state
- `StringRenderer` base component used by both others and for `string`
    - `StringIconRenderer` supports an icon additionally
    - `StringRendererDebounced` uses a debounced internal state

## Debounced Widgets

These widgets have an internal state and only after Xms the changes are synced to the actual UI Schema store.

- if the store value changes for the widget, any pending changes are reset and the actual-store value is applied
- if the user `blurs` the field, the value is applied directly, but only if the widget-value is different than the latest store value

Configurable debounce time with the prop `debounceTime`, in ms, defaults to `340`.

Not included in default `widgetsBinding`, can be used a drop-in replacement for the non-debounced versions.

## TextField Icons

Regarding icons, they are resolved by the `view` keywords `icon`, `iconEnd` and the [translation](/docs/localization) definition.

```ui-schema
{
    "type": "string",
    "widget": "StringIcon",
    "view": {
        "sizeMd": 6,
        "icon": "AccountBox",
        "iconEnd": "AccountBox"
    }
}
```

The value for `icon` gets translated like: `<Translate text={'icons.AccountBox'}/>`

When using the `ui-schema` immutable translator define them like:

```jsx harmony
import React from "react";
import AccountBox from "@mui/icons-material/AccountBox";

const dicEN = createMap({
    icons: {
        'AccountBox': () => <AccountBox/>
    }
});
```

### Bootstrap

```js
import {
    TextRenderer, NumberRenderer, StringRenderer
} from "@ui-schema/ds-bootstrap/Widgets/TextField";

const widgets = {
    types: {
        string: StringRenderer,
        number: NumberRenderer,
    },
    custom: {
        Text: TextRenderer,
    },
};
```

Components:

- `TextRenderer` supports multi-line text
    - extra keywords:
        - `view`
            - `rows` minimum rows visible
- `NumberRenderer` supports numbers

