# WidgetChipsRead

Read-only widgets for the `oneOf`-based `Chips`, works with the [UIMetaReadContextType](/docs/core-meta#read-context).

- type: `array`
- schema keywords
    - [Type Keywords](/docs/schema#type-string)
    - [View Keywords](/docs/schema#view-keyword)

## Components

```js
import {WidgetChipsRead} from '@ui-schema/ds-material/WidgetsRead'

const widgets = {
    custom: {
        SelectChips: WidgetChipsRead,
    },
};
```

**Supports extra keywords:**

- `view`
    - `hideTitle`
- `info` to render the [InfoRenderer](/docs/ds-material/InfoRenderer)

**Widgets:**

- `WidgetChipsRead` for `array` with `oneOf` sub-schema for the `items`
