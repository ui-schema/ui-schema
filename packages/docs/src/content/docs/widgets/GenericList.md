# Generic List

Widgets for complex structures in arrays.

[![Component Examples](https://img.shields.io/badge/Examples-green?labelColor=1d3d39&color=1a6754&logoColor=ffffff&style=flat-square&logo=plex)](#demo-editor) [![supports Material-UI Binding](https://img.shields.io/badge/Material-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=material-ui)](#material-ui)

- type: `array`
- widget keyword:
    - `GenericList`
- view
    - grid keywords
- works with the `items` keyword of arrays
    - can be any sub-schema
    - can be any widget
    - can be a list of sub-schemas (array-tuple)

- [Type Properties](/docs/schema#type-array)
- [View Keywords](/docs/schema#view-keyword)

## Design System

### Material-UI

```js
import {GenericList} from "@ui-schema/ds-material/es/Widgets/GenericList";

const widgets = {
    custom: {
        GenericList: GenericList
    },
};
```

Supports extra keywords:

- `view`
    - `btnSize` either `small` (default) or `medium`

Components:

- `GenericList` for list sub-schemas
