# Plugins

> Also check [the plugin concepts](/docs/plugins) and [the validator system](/docs/json-schema/validators).

## InheritKeywords

Inherit keywords from the `parentSchema` to all `schema`:

```typescript
import { InheritKeywords } from '@ui-schema/json-schema/InheritKeywords'

const schemaPlugins = [
    InheritKeywords(
        [
            ['view', 'dense'], // inherit the `.view.dense` schema keyword
        ],
    ),
]
```

Control when to inherit:

```typescript
import { InheritKeywords } from '@ui-schema/json-schema/InheritKeywords'
import { schemaTypeIs } from '@ui-schema/ui-schema/schemaTypeIs'

const schemaPlugins = [
    InheritKeywords(
        [['view', 'dense']],
        ({schema}) => !schemaTypeIs(schema?.get('type'), 'boolean'),
        // (/*{parentSchema, schema}*/) => false,
    ),
]
```

## SortPlugin

Sorts the `schema.properties` if `schema.sortOrder` exists, appends all non-sorted properties to the end.

```typescript
import { SortPlugin } from '@ui-schema/json-schema/SortPlugin'

const schemaPlugins = [
    SortPlugin,
]
```

```json
{
    "type": "object",
    "properties": {
        "prop_b": {},
        "prop_d": {},
        "prop_a": {},
        "prop_c": {}
    },
    "sortOrder": [
        "prop_a",
        "prop_b",
        "prop_x",
        "prop_c"
    ]
}
```

Results in:

```json
{
    "type": "object",
    "properties": {
        "prop_a": {},
        "prop_b": {},
        "prop_c": {},
        "prop_d": {}
    }
}
```
