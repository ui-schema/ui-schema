# Simple List

Widgets for native HTML text inputs to fill an array, usable for `string` (single/multiline), `number` types.

[![Component Examples](https://img.shields.io/badge/Examples-green?labelColor=1d3d39&color=1a6754&logoColor=ffffff&style=flat-square&logo=plex)](#demo-editor) [![supports Material-UI Binding](https://img.shields.io/badge/Material-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=material-ui)](#material-ui)

- type: `array`
- widget keyword:
    - `SimpleList`
- view
    - grid keywords
- works with the `items` keyword of arrays
    - items must be a single-schema (no tuple)
    - type must be either `string` or `number`
    - widget may be `Text`
- **recommended:** use `tt: "ol"` to get numeric listing labels, e.g. `1., 2., 3.` instead of `0, 1, 2`

- [Type Properties](/docs/schema#type-array)
- [View Keywords](/docs/schema#view-keyword)

## Design System

### Material-UI

```js
import {SimpleList} from "@ui-schema/ds-material/es/Widgets/SimpleList";

const widgets = {
    custom: {
        SimpleList: SimpleList
    },
};
```

Supports extra keywords:

- `view`
    - `btnSize` either `small` (default) or `medium`

Components:

- `SimpleList` for list of multine-line, single-line texts or numbers
