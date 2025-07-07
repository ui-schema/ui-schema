# UI Schema: Store

Components and Hooks responsible for store binding, configuration - and utilities for handling store changes.

## UIStore

Values are stored in `UIStore`, an immutable record, created with [createStore](#createstore) or [createEmptyStore](#createemptystore):

- `UIStore.values`:`{undefined|string|boolean|number|OrderedMap|List}`
- `UIStore.internals`:`{Map}`
- `UIStore.validity`:`{Map}`
- `UIStore.meta`:`{Map}` for generic usages
    - not managed by UI Schema and not extracted per-widget
    - use as "global meta store per generator"
    - `onChange` can receive & update the whole meta, nothing on-schema-level
- `UIStore.valuesToJS()`:`{*}` returns the values, but as JS compatible object, turning `Map`/`List` into `{}`/`[]`
- `UIStore.getValues()`:`{*}` returns the values
- `UIStore.getInternals()`:`{Map}` returns the internal values
- `UIStore.getValidity()`:`{Map}` returns the validity
- `UIStore.extractValues<V>(storeKeys: StoreKeys)`:`{value, internalValue}` extracts the `values` and `internals` values for a specific store position, the position is defined by `storeKeys` (e.g. which are passed to widgets)

Use the [updater functions](#store-updating--onchange) and [store actions](#store-actions) for store changes from widgets.

For best performance in non-scalar widgets use the [HOCs](https://reactjs.org/docs/higher-order-components.html) `extractValue`, `extractValidity` for getting the values, together with [memo](/docs/core-utils#memo--isequal).

General typings of the store:

```typescript jsx
import { UIStoreType } from '@ui-schema/ui-schema/UIStore'
```

## UIStoreProvider

Saves and provides the `store`, `onChange` and `schema`.

- Provider: `UIStoreProvider`
- Hook: `useUI` (*deprecated v0.3.0*, use `useUIStore` and `useUIStoreActions` instead)
    - returns: `{store: UIStoreType<D> | undefined, onChange: onChangeHandler<UIStoreActions>, showValidity: boolean}`
- Hook: `useUIStore<any>`
    - returns: `{store: UIStoreType<D> | undefined, showValidity: boolean}`
- Hook: `useUIStoreActions<UIStoreActions>`
    - returns: `{onChange: onChangeHandler<UIStoreActions>}`
- HOC to get the current values by `storeKeys` for one widget:
    - `extractValue` passes down: `value`, `internalValue`, `onChange`, `showValidity`, uses `UIStore.extractValues` internally
    - `extractValidity` passes down: `validity`, `onChange`, `showValidity`
- Properties:
    - `store`: `UIStore` the immutable record storing the current ui generator state
    - `onChange`: `function(actions): void` [a function capable of updating the saved store](#store-updating--onchange)
    - `showValidity`: `boolean|undefined`

See [core functions to update store](#store-updating--onchange) and [check `UIConfigContext` for other per-store/generator config](#uiconfigcontext).

Example creating the provider:

```js
import React from "react";
import {UIStoreProvider} from "@ui-schema/ui-schema";

const CustomProvider = ({store, onChange, children}) => {
    return <UIStoreProvider
        store={store}
        onChange={onChange}
    >{children}</UIStoreProvider>;
}
```

**Example Hook:**

```js
import React from "react";
import {isInvalid, useUIStore, useUIStoreActions} from "@ui-schema/ui-schema";

const Comp = ({storeKeys, ...props}) => {
    const {store} = useUIStore();
    const {
        onChange, // also passed down in props: `props.onChange` for widgets
    } = useUIStoreActions();

    store.getValidity();  // or use the HOC `extractValidity`
    store.getInternals(); // or use the HOC `extractValue`
    store.getValues();    // or use the HOC `extractValue`

    store.extractValidity(storeKeys);  // better than the HOC
    store.extractValue(storeKeys);  // better than the HOC

    store.meta.getIn(['config', 'some-user-setting']); // not mangaged/extracted by UI-Schema, handle/use like needed

    let invalid = isInvalid(validity, false); // Map, boolean: <if count>

    return null;// e.g. widget or plugin
};
```

**Example HOC:**

```js
import React from "react";
import {memo} from "@ui-schema/react/Utils/memo";
import {extractValue} from "@ui-schema/ui-schema/UIStore";

// `extractValue` uses `storeKeys` to get the `value`/`internalValue` from the store
// it also injects `onChange` and `showValidity`, allowing to overwrite `showValidity` from `props`
// use when needed for non-scalar widgets, exists in the default plugin stack with `ExtractStorePlugin`
const Comp = extractValue(
    memo(
        ({value, internalValue, onChange, showValidity, ...props}) => {
            return <SomeWidget {...props}/>
        }
    )
);
```

## createStore

Creates the initial store out of passed in values.

```js
import {createStore} from '@ui-schema/ui-schema/UIStore'
import {createOrderedMap} from '@ui-schema/ui-schema/createMap'

const [data, setStore] = React.useState(() => createStore(createOrderedMap(initialData)));
```

## createEmptyStore

Creates an empty store out of the schema type.

```js
import {createEmptyStore} from '@ui-schema/ui-schema/UIStore'

const [data, setStore] = React.useState(() => createEmptyStore(schema.get('type')/* as string */));
```

## Store Updating / onChange

The UIGenerator needs a `onChange` function which is used from within widgets to update the store, an instance of the `UIStore` immutable record.

See [simplest Text Widget](/docs/widgets#simplest-text-widget) for a basic widget example.

The `onChange` is responsible to update different parts of the [store](#uistore), individually or all at once. It can be used to update validity, values and non-standard elements with only one execution of `setStore` - which can be fully controlled by the using component.

Parameters:

- `actions`, one or multiple [store action](#store-actions)

Does not return anything.

```js
import React from 'react';
import {UIGenerator, createOrderedMap, createStore} from '@ui-schema/ui-schema';
import {storeUpdater} from '@ui-schema/ui-schema/storeUpdater';
import {widgets} from '@ui-schema/ds-material';

const Demo = () => {
    const [store, setStore] = React.useState(() => createStore(createOrderedMap({})));

    const onChange = React.useCallback((actions) => {
        setStore(prevStore => {
            // `storeUpdater` executes the updater or handles the `action`
            const newStore = storeUpdater(actions)(prevStore)
            return newStore
        })
    }, [setStore])

    // or `UIStoreProvider` instead of `UIGenerator`
    return <UIGenerator
        store={store}
        onChange={onChange}
        // add other props here
    />
};
```

### storeUpdater

The internal function to update the store, implements the `deleteOnEmpty` logic and handling the execution of `updater` and the updating of the store with the results.

Sets initial `OrderedMap` or `List` when changing nested elements - but the parent doesn't exist, thus forcing `object` to be `OrderedMap` or `List`, needed for comfortable `onChange` inside e.g. `GenericList` and drag 'n drops.

Returns a function which must receive the current store, it will return the updated store.

See example above on how to use it, additionally you can intercept the prevStore and nextStore through wrapping the function in logic.

```js
import {storeUpdater} from '@ui-schema/ui-schema/storeUpdater';
```

## Store Actions

Actions to update the store, handled within [`storeUpdater`](#storeupdater), the way to define custom handlers is [not that easy yet #163](https://github.com/ui-schema/ui-schema/issues/163).

The internal `scopeUpdaterValues` uses `action.schema` to handle e.g. `deleteOnEmpty`, treating [empty like in required HTML-inputs](/docs/schema#required-keyword).

Each action requires:

- `storeKeys`: `List<string | number>`, the keys of the value to update
- `scopes`: `string[]`, which scope to update, uses singular: `value`, `valid`, `internal`

```typescript jsx
import { UIStoreUpdaterData, UIStoreAction, UIStoreActionScoped } from '@ui-schema/ui-schema/UIStoreActions'

const baseAction: UIStoreAction & UIStoreActionScoped = {
    type: 'some-custom-action',
    // optional `effect` to do something else after internal data change,
    // but before the actual store-set/next render
    effect: (newData: UIStoreUpdaterData, newStore: UIStoreType): void => {
    }
}
```

### Action: Generic Update

```typescript jsx
onChange({
    storeKeys,
    scopes: ['value'],
    type: 'update',
    updater: ({value: oldValue}) => ({value: oldValue + 'some-input'}),
    schema,
    required,
})
```

### Action: Generic Set

Setting a specific data point, without relying on the `oldValue`:

```typescript jsx
onChange({
    storeKeys,
    scopes: ['value'],
    type: 'set',
    data: {
        value: 'some-input',
        //internalValue: undefined
        //valid: undefined
    },
    schema,
    required,
})

// onChange / storeUpdater supports multiple actions

onChange([{
    storeKeys: storeKeys.push('prob-a'),
    scopes: ['value'],
    type: 'set',
    data: {
        value: 'some-input',
        //internalValue: undefined
        //valid: undefined
    },
    schema,
    required,
}, {
    storeKeys: storeKeys.push('prob-b'),
    scopes: ['value'],
    type: 'set',
    data: {
        value: 'some-input',
        //internalValue: undefined
        //valid: undefined
    },
    schema,
    required,
}])
```

### Action: List Item Add

```javascript
onChange({
    storeKeys,
    type: 'list-item-add',
    schema: schema,
})
// OR with value:
onChange({
    storeKeys,
    type: 'list-item-add',
    itemValue: any
})
```

### Action: List Item Delete

```typescript jsx
onChange({
    // use the `storeKeys` of the list - NOT of the `item`!
    storeKeys: storeKeys.splice(-1, 1) as StoreKeys,
    type: 'list-item-delete',
    index: index as number,
})
```

### Action: List Item Move

```typescript jsx
// move "up" in the list:
onChange({
    // use the `storeKeys` of the list - NOT of the `item`!
    storeKeys: storeKeys.splice(-1, 1) as StoreKeys,
    type: 'list-item-move',
    fromIndex: index,
    toIndex: index - 1,
})

// move "down" in the list:
onChange({
    // use the `storeKeys` of the list - NOT of the `item`!
    storeKeys: storeKeys.splice(-1, 1) as StoreKeys,
    type: 'list-item-move',
    fromIndex: index,
    toIndex: index + 1,
})
```

### UpdateFn Migration

> content has moved to [Updated Notes v0.2.0 to v0.3.0](/updates/v0.2.0-v0.3.0#onchange--store-updater)

## UIConfigContext

Global configuration for a generator / store, coupled together with the [`UIStoreProvider`](#uistoreprovider), also available on its own as `UIConfigProvider`.

Should be used for seldom-changing-values, e.g. is used for the `doNotDefault` config of `Plugin/DefaultHandler`.

```typescript tsx
// for generic "allows any props as extra config"
<UIStoreProvider<{ [k: string]: any }>
    // `store`, `onChange`, `showValidity` are passed to `UIStoreContext` / `useUI`
    // all other will be available in all `PluginStack` / `useUIConfig`
/>

// explicit telling of allowed/expected-to-work `props`:
<UIStoreProvider<DefaultHandlerProps>
    // `store`, `onChange`, `showValidity` are passed to `UIStoreContext` / `useUI`
    // all other will be available in all `PluginStack` / `useUIConfig`
    doNotDefault={true}
/>

// now also tell e.g. `PluginStack` to use it
<PluginStack<DefaultHandlerProps>
    showValidity={showValidity}
    storeKeys={storeKeys.push('city') as StoreKeys}
    schema={schema.getIn(['properties', 'city']) as unknown as UISchemaMap}
    parentSchema={schema}
    // possible also to overwrite:
    doNotDefault={false}
/>
```

> hint: make a global `CustomUIMetaAndConfig` interface which serves to define your custom `UIMetaContext` and `UIConfigCOntext` as once
