# Select Chips

Widgets for select input for muli-selection.

[![Component Examples](https://img.shields.io/badge/Examples-green?labelColor=1d3d39&color=1a6754&logoColor=ffffff&style=flat-square&logo=plex)](#demo-ui-generator) [![supports Material-UI Binding](https://img.shields.io/badge/Material-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=material-ui)](#material-ui)

- type: `array` (of scalar values)
- widgets:
    - `SelectChips`
        - use `items.oneOf[].const` to specify array of values
        - produces `array` with selected values
- view
    - grid keywords

## Design System

### Material-UI

> not included in standard `widgetsBinding`

```js
import {SelectChips} from "@ui-schema/ds-material/Widgets/SelectChips";

const widgets = {
    custom: {
        SelectChips: SelectChips,
    },
};
```

Widgets:

- `SelectChips` select multiple values
    - use the schema of `oneOf` to supply the select translation
        - applies normal `Trans`/`tt` using:
            - the `title` if supplied
            - the `const` value as fallback
        - see demo schema below for an example
