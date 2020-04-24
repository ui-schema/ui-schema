# Select

Widgets for select input, either as 'select 1 from n' or 'select n from n'.

[![Component Examples](https://img.shields.io/badge/Examples-green?labelColor=1d3d39&color=1a6754&logoColor=ffffff&style=flat-square&logo=plex)](#demo-editor) [![supports Material-UI Binding](https://img.shields.io/badge/Material-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=material-ui)](#material-ui) [![supports Bootstrap Binding](https://img.shields.io/badge/Bootstrap-green?labelColor=3C2B57&color=563D7C&logoColor=ffffff&style=flat-square&logo=bootstrap)](#bootstrap)

- type: `string`, `array`
- widget keywords:
    - `Select` for a single value select
        - use `enum` to specify array of values
        - produces `array` with selected values
    - `SelectMulti` for a multi-value select
        - use `enum` to specify array of values
        - produces `string` containing the selected value
- view
    - grid keywords

- [String Type Keywords](/docs/schema#type-string)
- [Object Type Keywords](/docs/schema#type-object)
- [View Keywords](/docs/schema#view-keyword)

## Design System

### Material-UI

```js
import {
    Select, SelectMulti
} from "@ui-schema/ds-material/Widgets/Select";

const widgets = {
    custom: {
        Select,
        SelectMulti,
    },
};
```

Components:

- `Select` select single value
    - produces `string` containing the selected value
- `SelectMulti` select multiple values
    - use `enum` to specify array of values
    - produces `array` with selected values
- supported extra keywords:
    - `view.dense` : `boolean` for a smaller select popup
- See also [mui select component](https://material-ui.com/components/selects/)

### Bootstrap

```js
import {
    Select, SelectMulti
} from "@ui-schema/ds-bootstrap/Widgets/Select";

const widgets = {
    custom: {
        Select,
        SelectMulti,
    },
};
```

Components:

- `Select` select single value
    - produces `string` containing the selected value
- `SelectMulti` select multiple values
    - use `enum` to specify array of values
    - produces `array` with selected values
