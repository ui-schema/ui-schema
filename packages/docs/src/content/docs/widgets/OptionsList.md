# Options List

Widgets for multiple options, either as 'select 1 from n' or 'select n from n'.

[![Component Examples](https://img.shields.io/badge/Examples-green?labelColor=1d3d39&color=1a6754&logoColor=ffffff&style=flat-square&logo=plex)](#demo-ui-generator) [![supports Material-UI Binding](https://img.shields.io/badge/Material-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=mui)](#material-ui) [![supports Bootstrap Binding](https://img.shields.io/badge/Bootstrap-green?labelColor=3C2B57&color=563D7C&logoColor=ffffff&style=flat-square&logo=bootstrap)](#bootstrap)

- type: `string`, `array`
- widgets:
    - `OptionsCheck` multiple check boxes
        - use `items.oneOf[].const` to specify possible values and their restrictions
        - produces `array` with selected values
    - `OptionsRadio` radio inputs
        - use `enum` to specify array of possible values
        - produces `string` containing the selected value
- schema keywords
    - [String Type Keywords](/docs/schema#type-string)
    - [Object Type Keywords](/docs/schema#type-object)
    - [View Keywords](/docs/schema#view-keyword)

## Design System

### Material-UI

```js
import {
    OptionsRadio
} from "@ui-schema/ds-material/Widgets/OptionsRadio";

import {
    OptionsCheck
} from "@ui-schema/ds-material/Widgets/OptionsCheck";

const widgets = {
    custom: {
        OptionsCheck,
        OptionsRadio,
    },
};
```

**Supports extra keywords:**

- `view` keywords:
    - `dense`: `true` for a smaller select
- `info`
    - to render the [InfoRenderer](/docs/ds-material/Component/InfoRenderer)

**Widgets:**

- `OptionsCheck` multiple check boxes
    - `readOnly` inside `oneOf` schema: `boolean` to disable individual options
- `OptionsRadio` radio inputs

### Bootstrap

```js
import {
    OptionsRadio
} from "@ui-schema/ds-bootstrap/Widgets/OptionsRadio";
import {
    OptionsCheck
} from "@ui-schema/ds-bootstrap/Widgets/OptionsCheck";

const widgets = {
    custom: {
        OptionsRadio,
        OptionsCheck
    },
};
```

**Widgets:**

- `OptionsRadio` radio inputs
- `OptionsCheck` multiple check boxes
