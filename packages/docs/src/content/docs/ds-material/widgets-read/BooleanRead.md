# BooleanRead

Read-only widget for standard `boolean` type, works with the [UIMetaReadContextType](/docs/react/meta#read-context).

- type: `boolean`
- schema keywords
    - [Type Keywords](/docs/schema#type-string)
    - [View Keywords](/docs/schema#view-keyword)

## Components

```js
import {WidgetBooleanRead} from '@ui-schema/ds-material/WidgetsRead'

const widgets = {
    types: {
        boolean: WidgetBooleanRead,
    },
};
```

**Supports extra keywords:**

- `view`
    - `hideTitle`
- `info` to render the [InfoRenderer](/docs/ds-material/Component/InfoRenderer)

**Widgets:**

- `WidgetBooleanRead` for `boolean`
    - extra props:
        - `IconYes` to change the `true` icon
        - `IconNo` to change the `false` icon
