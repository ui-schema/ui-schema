# WidgetOneOfRead

Read-only widgets for `oneOf`-keyword based widgets, works with the [UIMetaReadContextType](/docs/core-meta#read-context).

- type: -
- schema keywords
    - [Type Keywords](/docs/schema#type-string)
    - [View Keywords](/docs/schema#view-keyword)

## Components

```js
import {WidgetOneOfRead} from '@ui-schema/ds-material/WidgetsRead'

const widgets = {
    custom: {
        SelectMulti: WidgetOneOfRead,
        OptionsCheck: WidgetOneOfRead,
    },
};
```

**Supports extra keywords:**

- `view`
    - `hideTitle`
- `info` to render the [InfoRenderer](/docs/ds-material/Component/InfoRenderer)

**Widgets:**

- `WidgetOneOfRead`, a generic read-widget
