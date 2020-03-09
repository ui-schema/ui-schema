# Options List

Widgets for multiple options, either as 'select 1 from n' or 'select n from n'.

[![Component Examples](https://img.shields.io/badge/Examples-green?labelColor=1d3d39&color=1a6754&logoColor=ffffff&style=flat-square&logo=plex)](#demo-editor) [![supports Material-UI Binding](https://img.shields.io/badge/Material-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=material-ui)](#material-ui) [![supports Bootstrap Binding](https://img.shields.io/badge/Bootstrap-green?labelColor=3C2B57&color=563D7C&logoColor=ffffff&style=flat-square&logo=bootstrap)](#bootstrap)

- type: `string`, `array`
- widget keywords:
    - `OptionsCheck` for checkboxes
    - `OptionsRadio` for radio select
- view
    - grid keywords

- [String Type Keywords](/docs/schema#type-string)
- [Object Type Keywords](/docs/schema#type-object)
- [View Keywords](/docs/schema#view-keyword)

## Design System

### Material-UI

```js
import {
    OptionsCheck, OptionsRadio
} from "@ui-schema/ds-material/es/Widgets/Options";

const widgets = {
    custom: {
        OptionsCheck,
        OptionsRadio,
    },
};
```

Components:

- `OptionsCheck` multiple check boxes
    - use `enum` to specify array of values
    - produces `array` with selected values
- `OptionsRadio` radio inputs
    - produces `string` containing the selected value

### Bootstrap

```js
import {
    OptionsRadio
} from "@ui-schema/ds-bootstrap/es/Widgets/OptionsRadio";
import {
    OptionsCheck
} from "@ui-schema/ds-bootstrap/es/Widgets/OptionsCheck";

const widgets = {
    custom: {
        OptionsRadio,
        OptionsCheck
    },
};
```

Components:

- `OptionsRadio` radio inputs
    - produces `string` containing the selected value
    
- `OptionsCheck` multiple check boxes
    - use `enum` to specify array of values
    - produces `array` with selected values
