---
docModule:
    package: '@ui-schema/ui-schema'
    modulePath: "ui-schema/src/"
    files:
        - "Utils/*"
---

# Utils

## beautify

See [localization text-transform](/docs/localization#text-transform), this is the base function for beautifying.

```js
import {beautify} from '@ui-schema/ui-schema/Utils/beautify'
```

## createMap

Deep change directly from `{}` or `[]` to `Map`/`List` structures:

```js
import {createMap} from '@ui-schema/ui-schema/createMap'

let dataMap = createMap({});
```

## createOrderedMap

Deep change directly from `{}` or `[]` to `OrderedMap`/`List` structures:

```js
import {createOrderedMap} from '@ui-schema/ui-schema/createMap'

let dataMap = createOrderedMap({});
```

## fromJSOrdered

Function to deep change an object into an ordered map, will change the objects properties but not the root-object.

```js
import {OrderedMap} from 'immutable'
import {fromJSOrdered} from '@ui-schema/ui-schema/Utils/fromJSOrdered'

let dataMap = OrderedMap(fromJSOrdered({}));
```

## moveItem

Helper for moving an item inside a `List`/`array`, useful for moving up/down inside a list widget.

> **better use [store actions](/docs/react/store#store-actions) instead!**

```js
import {useImmutable} from '@ui-schema/ui-schema/Utils/useImmutable'

// moving "up" in an sortable list
onChange({
    storeKeys,
    scopes: ['value', 'internal'],
    type: 'update',
    updater: ({value, internal}) => ({
        value: moveItem(value, index, index - 1),
        internal: // todo implement
    }),
    schema,
    required,
})

// moving "down" in an sortable list
onChange({
    storeKeys,
    scopes: ['value', 'internal'],
    type: 'update',
    updater: ({value, internal}) => ({
        value: moveItem(value, index, index + 1),
        internal: // todo implement
    }),
    schema,
    required,
})

```

## isEqual

ImmutableJS compatible equality checker.

```js
import {isEqual} from '@ui-schema/ui-schema';
```

## mergeSchema

Merges two schemas into each other: `ab = mergeSchema(a, b)`

Supports merging of these keywords, only does something if existing on `b`:

- `properties`, deep-merge b into a
- `required`, combining both arrays/lists
- `type`, b overwrites a
- `format`, b overwrites a
- `widget`, b overwrites a
- `enum`, b overwrites a
- `const`, b overwrites a
- `not`, b overwrites a
- `allOf`, are ignored, should be resolved by e.g. [combining handler](/docs/plugins#combininghandler)
- `if`, `then`, `else` are ignored, should be resolved by e.g. [conditional handler](/docs/plugins#conditionalhandler), also `if` that are inside `allOf`

## sortScalarList

Sorts `string` and `number` values inside a `List` in `asc` order, useful for better "is-same-as-initial" when seleting enum values:

```js
import {sortScalarList} from '@ui-schema/ui-schema/Utils/sortScalarList';

onChange({
    storeKeys,
    scopes: ['value'],
    type: 'update',
    updater: ({value: val = List()}) =>
        ({
            value: sortScalarList(
                val.contains(enum_name) ?
                    val.delete(val.indexOf(enum_name)) :
                    val.push(enum_name)
            ),
        }),
    schema,
    required,
})
```
