# WidgetEnumRead

Read-only widgets for `enum`-keyword based widgets, works with the [UIMetaReadContextType](/docs/core-meta#read-context).

- type: -
- schema keywords
    - [Type Keywords](/docs/schema#type-string)
    - [View Keywords](/docs/schema#view-keyword)

## Components

```js
import {WidgetEnumRead} from '@ui-schema/ds-material/WidgetsRead'

const widgets = {
    custom: {
        Select: WidgetEnumRead,
        OptionsRadio: WidgetEnumRead,
    },
};
```

**Supports extra keywords:**

- `view`
    - `hideTitle`
- `info`
    - supported by all except the `*Icon` widgets, to render the [InfoRenderer](/docs/ds-material/InfoRenderer)

**Widgets:**

- `WidgetEnumRead`, a generic read-widget
