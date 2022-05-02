# Generic List

Widgets for complex structures in arrays.

[![Component Examples](https://img.shields.io/badge/Examples-green?labelColor=1d3d39&color=1a6754&logoColor=ffffff&style=flat-square&logo=plex)](#demo-ui-generator) [![supports Material-UI Binding](https://img.shields.io/badge/Material-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=material-ui)](#material-ui)

- type: `array`
- widget keyword:
    - `GenericList`
- works with the `items` keyword of arrays
    - can be any sub-schema
    - can be any widget
    - can be a list of sub-schemas (array-tuple)
- schema keywords
    - [Type Keywords](/docs/schema#type-array)
    - [View Keywords](/docs/schema#view-keyword)

## Design System

### Material-UI

> see the [GenericList base components](/docs/ds-material/GenericList) for further customization and details about label translation

```js
import {GenericList} from "@ui-schema/ds-material/Widgets/GenericList";

const widgets = {
    custom: {
        GenericList: GenericList
    },
};
```

**Supports extra keywords:**

- `view`
    - `btnSize` either `small` (default) or `medium`, used for the add-button
    - `deleteBtnSize` either `small` (default) or `medium`, used for the delete-button
    - `btnVariant` either `text | outlined | contained`, used for the add-button
    - `btnVariant` either `text | outlined | contained`, used for the add-button
    - `btnColor` either `inherit | primary | secondary | default`, used for the add-button
    - `hideTitle` when `true` doesn't show any title
- `listActionLabels` used for [named-label translation](/docs/ds-material/GenericList#translation--labels)
- `notDeletable` when `true` doesn't allow deletion of items
- `notAddable` when `true` doesn't allow adding items
- `notSortable` when `true` doesn't allow sorting of items
- `info`
    - to render the [InfoRenderer](/docs/ds-material/Component/InfoRenderer)

**Widgets:**

- `GenericList` for list sub-schemas
