# Color Picker

Widgets for color picking, design-system implementation.

[![Component Examples](https://img.shields.io/badge/Examples-green?labelColor=1d3d39&color=1a6754&logoColor=ffffff&style=flat-square&logo=plex)](#demo-editor) [![supports Material-UI Binding](https://img.shields.io/badge/Material-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=material-ui)](#material-ui)

- type: `string`
- main widget keywords:
    - `Color`
    - `ColorDialog`
    
## Design System

### Material-UI

Color picker using [react-color](https://casesandberg.github.io/react-color), inspired by [material-ui-color-picker](https://github.com/LoicMahieu/material-ui-color-picker/).

```bash
npm i --save @ui-schema/material-color
```

- special keywords:
    - `view.alpha` when `true` it enables alpha selection
    - `view.iconOn` when `true` the input icon is shown the hole time
    - `format` to select the transformation, optional, when not specified uses hex when possible otherwise rgba
        - `hex` to get only hex values (alpha is disabled for this format)
        - `rgb` to get rgb values (alpha is disabled for this format)
        - `rgb+a` to get rgb or rgba values
        - `rgba` to get rgba values
    - `pattern` should be used for validation
        - this would allow only 3 or 6 letter HEX values like `#00f` or `#0000ff`
        - `^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$`
- 11 themes, up to three different modes:
    - `Color<Name>` uses material-ui textfield and opens the picker on focus
    - `Color<Name>Dialog` uses material-ui textfield and opens the picker on focus as full-page dialog
    - `Color<Name>Static` shows only the picker the whole time 
- ChromePicker, default and recommended
    - widgets: `Color`, `ColorDialog`, `ColorStatic` 
- SwatchesPicker
    - widgets: `ColorSwatches`
    - supports `view.colors` to select shown colors, or:
    - supports `enum` to restrict colors
    - todo: support color-groups from schema 
- CirclePicker
    - widgets: `ColorCircle`, `ColorCircleStatic`
    - supports `view.colors` to select shown colors, or:
    - supports `enum` to restrict colors
- CompactPicker
    - widgets: `ColorCompact`
    - supports `view.colors` to select shown colors
- MaterialPicker
    - widgets: `ColorMaterial`
- BlockPicker
    - widgets: `ColorBlock`
    - supports `view.colors` to select shown colors, or:
    - supports `enum` to restrict colors
- TwitterPicker
    - widgets: `ColorTwitter`, `ColorTwitterStatic`
    - supports `view.colors` to select shown colors, or:
    - supports `enum` to restrict colors
- SliderPicker
    - widgets: `ColorSlider`, `ColorSliderStatic`
- AlphaPicker
    - widgets: `ColorAlpha`
- HuePicker
    - widgets: `ColorHue`
- SketchPicker
    - widgets: `ColorSketch`, `ColorSketchStatic`, `ColorSketchDialog` 
    - supports `view.colors` to select shown colors
