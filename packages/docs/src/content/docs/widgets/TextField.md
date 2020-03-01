# TextField

Widgets for native HTML text inputs, usable for `string` (single/multiline), `number` types and browser supported formats.

[![Component Examples](https://img.shields.io/badge/Examples-green?labelColor=1d3d39&color=1a6754&logoColor=ffffff&style=flat-square&logo=plex)](#demo-editor) [![supports Material-UI Binding](https://img.shields.io/badge/Material-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=material-ui)](#material-ui)

- type: `string`, `number`
- formats:
    - `date`
    - `email`
    - `tel`, must also be validated with `pattern`, as there is no tel-format worldwide specified 
- widget keywords:
    - `Text` for multi-line text
    - `StringIcon` for single-line text with icon
    - `TextIcon` for multi-line text with icon
    - `NumberIcon` for number input with icon
- view
    - grid keywords

- [Type Properties](/docs/schema#type-string)
- [View Keywords](/docs/schema#view-keyword)

## Design System

### Material-UI

```js
import {
    TextRenderer, NumberRenderer, StringRenderer
} from "@ui-schema/ds-material/es/Widgets/TextField";
import {
    TextIconRenderer, NumberIconRenderer, StringIconRenderer
} from "@ui-schema/ds-material/es/Widgets/TextFieldIcon";

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

Supports extra keywords:

- `view`
    - `variant`
    - `margin`
    - `dense` if `true` applies size `small`
    - `shrink` to `true` to always have the label up, e.g. native-date may look wrong otherwise in some browsers (use @ui-schema/material-pickers for best date/time support) 
- `formats`
    - supports browser based translations for format mismatch, schema key: `t: 'browser''` (will be moved to another way)

Components:

- `TextRenderer` supports multi-line text
    - extra keywords:
        - `view`
            - `rows` minimum rows visible
            - `rowsMax` maximum rows visible
            - if both are set, the `textarea` grows until `rowsMax` is reached
    - `TextIconRenderer` supports an icon additionally
- `NumberRenderer` supports numbers
    - `NumberIconRenderer` supports an icon additionally
- `StringRenderer` base component used by both others and for `string`
    - `StringIconRenderer` supports an icon additionally
    
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

The value for `icon` gets translated like: `<Trans text={'icons.AccountBox'}/>`

When using the `ui-schema` immutable translator define them like:

```jsx harmony
import React from "react";
import AccountBox from "@material-ui/icons/AccountBox";

const dicEN = createMap({
    icons: {
        'AccountBox': () => <AccountBox/>
    }
});
```
