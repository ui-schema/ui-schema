# Number Slider

Widgets for selecting one, two or multiple numbers from a specified range, with specified steps.

[![Component Examples](https://img.shields.io/badge/Examples-green?labelColor=1d3d39&color=1a6754&logoColor=ffffff&style=flat-square&logo=plex)](#demo-ui-generator) [![supports Material-UI Binding](https://img.shields.io/badge/Material-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=material-ui)](#material-ui)

- type: `number`, `integer`, `array`
- widget keyword:
    - `NumberSlider`
- view
    - grid keywords
- type `number`, `integer` works with number validation keywords:
    - `multipleOf` defines the step size
    - `minimum`, `exclusiveMinimum` defines the minimum selectable, sets the default
        - when using together with `multipleOf`, min must be a valid multipleOf, otherwise the value can not be selected
    - `maximum`, `exclusiveMaximum` defines the maximum selectable
    - `enum` or `const` restricts selection to values defined in `enum/const`
- type `array` gets the number validation keywords from the array keyword `items`
    - `minItems` controls the initial thumb quantity, `2` default, a minimum of `2` are needed
    - `maxItems` controls the maximum thumb quantity, if set controls max thumbs that can be added
        - if the same as `minItems` does not allow adding/removing items

- [Type Properties](/docs/schema#type-array)
- [View Keywords](/docs/schema#view-keyword)

## Design System

### Material-UI

```js
import {NumberSlider} from "@ui-schema/ds-material/Widgets/NumberSlider";

const widgets = {
    custom: {
        NumberSlider: NumberSlider
    },
};
```

- `min` defaults to 0 and max to 100
- customization keywords:
    - `view.marks` optional
        - when falsy it is a continuous slider
        - when `true` all steps are marked but not labeled
        - when `array` defines labels on the track
        - `[1, 2, 4]`, these values now get combined with `view.markslabel` to e.g. `1°C`
    - `view.marksLabel` label for accessibility and marks
        - e.g. `°C` will be added as `15°C`, (space/blank)` cm` as `15 cm`
    - `view.tooltip` optional, `auto` enables tooltip on hover or `on` for permanent
    - when restricted with `enum/const`
        - `view.marksLabel` is used also to label the track
        - `view.marks` is ignored
    - `view.track`:`string|boolean` to control the track highlighting
        - `false` the track is turned off
        - `inverted` inverts the tracks and when range set's one initial to the end
    - `view.mt`:`number` for spacing top, e.g. `2` is recommended for multi
    - `view.mb`:`number` for spacing bottom, e.g. `2` is recommended for multi
