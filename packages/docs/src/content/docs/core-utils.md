# Utils

## beautify

See [localization text-transform](/docs/localization#text-transform), this is the base function for beautifying.

```js
import {beautify} from '@ui-schema/system/Utils/beautify'
```

## createMap

Deep change directly from `{}` or `[]` to `Map`/`List` structures:

```js
import {createMap} from '@ui-schema/system/Utils/createMap'

let dataMap = createMap({});
```

## createOrderedMap

Deep change directly from `{}` or `[]` to `OrderedMap`/`List` structures:

```js
import {createOrderedMap} from '@ui-schema/system/Utils/createMap'

let dataMap = createOrderedMap({});
```

## fromJSOrdered

Function to deep change an object into an ordered map, will change the objects properties but not the root-object.

```js
import {OrderedMap} from 'immutable'
import {fromJSOrdered} from '@ui-schema/ui-schema/Utils/fromJSOrdered'

let dataMap = new OrderedMap(fromJSOrdered({}));
```

## useImmutable

Hook for performance optimizing when using dynamically creates immutables like `storeKeys` inside `React.useEffect`/`React.useCallback` etc.

```js
import {useImmutable} from '@ui-schema/ui-schema/Utils/useImmutable'

const Comp = () => {
    const currentStoreKeys = useImmutable(storeKeys)

    React.useEffect(() => {
        // do something when `valid` has changed (or storeKeys)
        // with just `storeKeys` may rerun every render
        //   -> as it's an dynamically created immutable
    }, [onChange, valid, currentStoreKeys])

    return null
}
```

## useDebounceValue

Hook for executing onChange handlers after a delay or after the user ended editing - using a separately state, which is kept in-sync on downstream updates.

```typescript jsx
import { useDebounceValue } from '@ui-schema/ui-schema/Utils/useDebounceValue'
import { WithScalarValue } from '@ui-schema/ui-schema/UIStore'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'

const Comp: React.ComponentType<WidgetProps & WithScalarValue> = (
    {onChange, storeKeys, schema, required, value},
) => {

    // the `setter` is executed when the value has been changed by either `bubbleBounce` or after the delay, triggered by the `onChange`
    const setter = React.useCallback((newVal: string | number | undefined) => {
        onChange({
            storeKeys,
            scopes: ['value'],
            type: 'set',
            schema,
            required,
            data: {value: newVal},
        })
    }, [storeKeys, onChange, schema, required])

    const debounceTime = 340
    const {bounceVal, setBounceVal, bubbleBounce} = useDebounceValue<string | number>(value as string | number | undefined, debounceTime, setter)

    return <input
        type={'text'}
        value={bounceVal.value || ''}
        onBlur={() => {
            // triggers a direct run, with comparison to the latest known-value,
            // executes `setter` only when `bounceVal.value` is not `value`
            bubbleBounce(value)
        }}
        onChange={(e) => {
            const val = e.target.value
            setBounceVal({changed: true, value: val})
        }}
    />
}
```

## moveItem

Helper for moving an item inside a `List`/`array`, useful for moving up/down inside a list widget.

> **better use [store actions](/docs/core-store#store-actions) instead!**

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

## memo / isEqual

ImmutableJS compatible `React.memo` memoization/equality checker.

```js
import React from 'react';
import {isEqual, memo} from '@ui-schema/ui-schema';

// `Comp` will only re-render when the props changes, compares immutable maps and lists correctly.
const Comp = memo(props => {
    let res = someHeavyLogic(props);
    return <div>
        Complex HTML that should only re-render when needed
        <OtherComponent {...res}/>
    </div>;
});
```

See [performance](/docs/performance) for the reasons and philosophy behind it.

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
