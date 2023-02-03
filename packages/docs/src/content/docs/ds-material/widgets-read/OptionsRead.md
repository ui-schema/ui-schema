# WidgetOptionsRead

Read-only widgets for `oneOf` and `enum`-keyword based widgets, works with the [UIMetaReadContextType](/docs/core-meta#read-context).

- type: -
- schema keywords
    - [Type Keywords](/docs/schema#type-string)
    - [View Keywords](/docs/schema#view-keyword)

## Components

```js
import {WidgetOptionsRead} from '@ui-schema/ds-material/WidgetsRead'

const widgets = {
    custom: {
        Select: WidgetOptionsRead,
        SelectMulti: WidgetOptionsRead,
        OptionsRadio: WidgetOptionsRead,
        OptionsCheck: WidgetOptionsRead,
    },
};
```

**Supports extra keywords:**

- `view`
    - `hideTitle`
- `info` to render the [InfoRenderer](/docs/ds-material/Component/InfoRenderer)

**Widgets:**

- `WidgetOptionsRead`, a generic read-widget
