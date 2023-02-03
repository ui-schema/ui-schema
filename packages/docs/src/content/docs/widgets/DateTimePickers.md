# Date + Time Pickers

Widgets for date, datetime, time selection, design-system implementation.

[![Component Examples](https://img.shields.io/badge/Examples-green?labelColor=1d3d39&color=1a6754&logoColor=ffffff&style=flat-square)](#demo-ui-generator) [![supports Material-UI Binding](https://img.shields.io/badge/Material-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=mui)](#material-ui)

>
> 🚧 (deprecated) docs for `v0.3.0` of `@ui-schema/material-pickers` for `@material-ui/core`
>
> full rewrite of picker widgets in progress, [see docs for `@mui/x-date-pickers`](/docs/material-pickers/Overview)
>

- widget keywords:
    - `Date`
    - `Time`
    - `DateTime`
- `default` if `now` uses current timestamp (todo: store updating)
- `format` keyword is used additionally for validation (todo: add format validations to translation and add pattern examples)
- `date` keyword is a special collection of keywords only intended for better date-time customization, not validation
    - `format` date-time format string, controls how the value is displayed
        - is not set defaults to `yyyy-MM-dd` for Date, `yyyy-MM-dd HH:mm` for DateTime and `HH:mm` for Time
    - `formatData` date-time format string, controls how the value is saved, when not set, `format` is used
        - this library supports `x`/`X` format for seconds and microseconds

## Design System

### Material-UI

```bash
npm i --save @ui-schema/material-pickers @material-ui/pickers
```

- extra `date` keywords:
    - `keyboard`: `false` disabled keyboard-input mask
    - `views`: `undefined|[]` what can be selected, if not set, everything is shown
        - DatePicker: `year`, `month`, `date`
        - DateTimePicker: `year` | `date` | `month` | `hours` | `minutes`
        - TimePicker: `hours` | `minutes`
    - `variant`: `string` contents one of: `inline`, `static`, `dialog`
    - `autoOk`: `false` disables closing date selection when using e.g. mobile and not inline and entered last date
    - `disableFuture`: `true` to disable future selection
    - `disablePast`: `true` to disable past selection
    - `toolbar`: `true` to enable the toolbar
    - `clearable`: `true` to enable deletion
    - `openTo`: `year`, `month`, `date`, date is default, use with `variant: 'static'`
    - `minDate`: `string` - must be specified in ISO format
    - `maxDate`: `string` - must be specified in ISO format
- `view` keywords:
    - `dense`: `true` enables denser margin
    - `justify`: `string` to overwrite alignment of content: `center`
- DatePicker special
    - `date`
        - `orientation`: `landscape`, `portrait`
- DateTimePicker + TimePicker special
    - `date`
        - `tabs`: `true` to enable the tabs
        - `minutesStep`: `number`
        - `ampm`: `false` to disable `am/pm` selection
- todo: should also be possible to use split version: keyboard + mobile or only mobile for less package size

See [@material-ui/pickers documentation](https://material-ui-pickers.dev) for further information.

Setup the widgets:

Install preferred date library and the **v1** date-io adapter, e.g. using luxon:

```bash
npm i --save @date-io/luxon@1 luxon
```

Wrap the editor some where with the pickers provider and add the widgets:

```jsx harmony
import React from 'react';

import {UIGenerator} from "@ui-schema/ui-schema";
import {widgets} from "@ui-schema/ds-material";
import {TimePicker, DatePicker, DateTimePicker} from "@ui-schema/material-pickers";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import LuxonAdapter from "@date-io/luxon";

const customWidgets = {...widgets};
customWidgets.custom = {
    ...widgets.custom,
    DateTime: DateTimePicker,
    Date: DatePicker,
    Time: TimePicker,
};

// Exporting a ui generator that can use the pickers
export default (props) => <MuiPickersUtilsProvider utils={LuxonAdapter}>
    <UIGenerator
        widgets={customWidgets}
        {...props}
    />
</MuiPickersUtilsProvider>
```
