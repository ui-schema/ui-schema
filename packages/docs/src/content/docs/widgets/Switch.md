# Switch

Widget for single `boolean`.

[![Component Examples](https://img.shields.io/badge/Examples-green?labelColor=1d3d39&color=1a6754&logoColor=ffffff&style=flat-square&logo=plex)](#demo-editor) [![supports Material-UI Binding](https://img.shields.io/badge/Material-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=material-ui)](#material-ui)

- type: `boolean`
- widget keywords:
    - `Switch` for checkboxes
- view
    - grid keywords

- [Type Properties](/docs/schema#type-boolean)

## Design System

### Material-UI

```js
import {
    BoolRenderer
} from "@ui-schema/ds-material/es/Widgets/Options";

const widgets = {
    types: {
        boolean: BoolRenderer,
    },
};
```

Components:

- `BoolRenderer` single [mui switch component](https://material-ui.com/components/switches/#switches-with-formcontrollabel)
