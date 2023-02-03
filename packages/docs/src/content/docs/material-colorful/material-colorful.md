# Color Picker: react-colorful

[![Component Examples](https://img.shields.io/badge/Examples-green?labelColor=1d3d39&color=1a6754&logoColor=ffffff&style=flat-square)](#demo-ui-generator)

- type: `string`, `object`
- widget keywords:
    - `Colorful`
    - `ColorfulHsl`
    - `ColorfulRgba`

## Widget

Color picker using [react-colorful](https://www.npmjs.com/package/react-colorful), simple visual picker without input field.

```bash
npm i --save @ui-schema/material-color react-color
```

**Keywords:**

- `view.hideTitle` when `true` it does not show the title, only the current format
- `view.pickerWidth`: `string|number`, the CSS width of the picker, defaults to `100%`
- `view.pickerHeight`: `string|number`, the CSS height of the picker, defaults to `react-colorful` default (atm. `200px`)
- `view.showValueText`: `boolean`, when `true` shows the current color as small caption below the picker

## Example Setup

```typescript jsx
import React from 'react'
import {
    extractValue, memo,
    WidgetProps, WithScalarValue, WithValue,
} from '@ui-schema/ui-schema'
import { WidgetColorful } from '@ui-schema/material-colorful'
import {
    HexColorPicker,
    HslaColorPicker,
    RgbaColorPicker,
    RgbaStringColorPicker,
} from 'react-colorful'

const ColorfulHex: React.FC<WidgetProps & WithScalarValue> = (props) => <WidgetColorful ColorfulPicker={HexColorPicker} {...props}/>
const ColorfulHslaBase: React.FC<WidgetProps & WithValue> = (props) => <WidgetColorful ColorfulPicker={HslaColorPicker} {...props}/>
const ColorfulHsla = extractValue(memo(ColorfulHslaBase))
const ColorfulRgbaBase: React.FC<WidgetProps & (WithScalarValue | WithValue)> =
    (props) =>
        <WidgetColorful
            // todo: find a way to safely type the inner `ColorfulPicker`, as this is not incorrect per-se,
            //       as the widget handles string vs. object on change / rendering
            // @ts-ignore
            ColorfulPicker={props.schema.get('type') === 'string' ? RgbaStringColorPicker : RgbaColorPicker}
            {...props}
        />
const ColorfulRgba = extractValue(memo(ColorfulRgbaBase))

export const customWidgets = {
    //...widgets,
    //types: widgets.types,
    custom: {
        Colorful: ColorfulHex,
        ColorfulHsla: ColorfulHsla,
        ColorfulRgba: ColorfulRgba,
    },
}
```
