---
docModule:
    package: '@ui-schema/react'
    modulePath: "react/src/"
    fromPath: "Utils"
    files:
        - "Utils/*"
---

# React Utils

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
import { WidgetProps } from '@ui-schema/react/Widget'

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

## memo

ImmutableJS compatible `React.memo` memoization.

```js
import React from 'react';
import {memo} from '@ui-schema/ui-schema';

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
