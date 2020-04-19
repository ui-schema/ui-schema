# Simple List

Widgets for native HTML text inputs to fill an array, usable for `string` (single/multiline), `number` types.

[![Component Examples](https://img.shields.io/badge/Examples-green?labelColor=1d3d39&color=1a6754&logoColor=ffffff&style=flat-square&logo=plex)](#demo-editor) [![supports Material-UI Binding](https://img.shields.io/badge/Material-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=material-ui)](#material-ui) [![supports Bootstrap Binding](https://img.shields.io/badge/Bootstrap-green?labelColor=3C2B57&color=563D7C&logoColor=ffffff&style=flat-square&logo=bootstrap)](#bootstrap)

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

### Bootstrap

```js
import {SimpleList} from "./Widgets/SimpleList";

const widgets = {
    custom: {
        SimpleList: SimpleList
    },
};
```

Supports extra keywords:

- `view`
    - `btnSize` either `small` (default) - 18px or `medium` - 24px or `big` - 42px

Components:

- `SimpleList` for list of multine-line, single-line texts or numbers


Needed other Component:

- `Icon`

The SimpleList widget uses icons (`Plus` and `Minus`), which have a tooltip and a translation for the tooltip. The translation component must be imported:

```js
import {Trans, useEditor} from "@ui-schema/ui-schema";
```

The translated text can be inserted with: `labels.add`and `labels.remove`

The tooltip need jQuery to be imported from node-modules to bootstrap parent component:

- in `Main.js`:

```js
import "bootstrap";
import $ from "jquery";

window.$ = $;
```





