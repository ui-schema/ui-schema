# TextFieldRead

Read-only widgets for standard `string` (single/multiline) and `number` types, works with the [UIMetaReadContextType](/docs/react/meta#read-context).

- type: `string`, `number`, `integer`
- schema keywords
    - [Type Keywords](/docs/schema#type-string)
    - [View Keywords](/docs/schema#view-keyword)

## Components

```js
import {
    NumberRendererRead, StringRendererRead, TextRendererRead,
} from '@ui-schema/ds-material/WidgetsRead'

const widgets = {
    types: {
        string: StringRendererRead,
        number: NumberRendererRead,
        int: NumberRendererRead,
        boolean: WidgetBooleanRead,
    },
    custom: {
        Text: TextRendererRead,
    },
};
```

**Supports extra keywords:**

- `view`
    - `hideTitle`
- `info` to render the [InfoRenderer](/docs/ds-material/Component/InfoRenderer)

**Widgets:**

- `NumberRendererRead` for `int`/`number`
- `StringRendererRead` for `string`
- `TextRendererRead` for `string` with multilines (using line-breaks)
