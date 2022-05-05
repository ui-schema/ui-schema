# Switch

Widget for single `boolean`.

[![Component Examples](https://img.shields.io/badge/Examples-green?labelColor=1d3d39&color=1a6754&logoColor=ffffff&style=flat-square&logo=plex)](#demo-ui-generator) [![supports Material-UI Binding](https://img.shields.io/badge/Material-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=mui)](#material-ui) [![supports Bootstrap Binding](https://img.shields.io/badge/Bootstrap-green?labelColor=3C2B57&color=563D7C&logoColor=ffffff&style=flat-square&logo=bootstrap)](#bootstrap)

- type: `boolean`
- widget keywords:
    - `Switch` for checkboxes
- schema keywords
    - [Type Keywords](/docs/schema#type-boolean)
    - [View Keywords](/docs/schema#view-keyword)

## Design System

### Material-UI

```js
import {
    BoolRenderer
} from "@ui-schema/ds-material/Widgets/OptionsBoolean";

const widgets = {
    types: {
        boolean: BoolRenderer,
    },
};
```

**Supports extra keywords:**

- `view`
    - `hideTitle` when `true` doesn't show any title
- `readOnly`

**Components:**

- `BoolRenderer` single [mui switch component](https://material-ui.com/components/switches#switches-with-formcontrollabel)
    - supports usage as cell for a [Table widget](/docs/widgets/Table)

### Bootstrap

```js
import {
    BoolRenderer
} from "@ui-schema/ds-bootstrap/Widgets/OptionsBoolean";

const widgets = {
    types: {
        boolean: BoolRenderer,
    },
};
```

Components:

- `BoolRenderer`: produces boolean
