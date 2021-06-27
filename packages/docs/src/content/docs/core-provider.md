# UI Schema Provider & Store

Components and functions exported by `@ui-schema/ui-schema` for usage within design systems, plugins and widgets.

Components responsible for store binding, configuration.

> ❗ The `UIMetaProvder` and thus usages of `UIGenerator`, `UIProvider`,`UIStoreProvider` will have a breaking change in `v0.3.0` to enable even better performance optimizes, [see issue](https://github.com/ui-schema/ui-schema/issues/80)

## UIStore

Values are stored in `UIStore`, an immutable record, created with [createStore](#createstore) or [createEmptyStore](#createemptystore):

- `UIStore.values`:`{undefined|string|boolean|number|OrderedMap|List}`
- `UIStore.internals`:`{Map}`
- `UIStore.validity`:`{Map}`
- `UIStore.valuesToJS()`:`{*}` returns the values, but as JS compatible object, turning `Map`/`List` into `{}`/`[]`
- `UIStore.getValues()`:`{*}` returns the values
- `UIStore.getInternals()`:`{Map}` returns the internal values
- `UIStore.getValidity()`:`{Map}` returns the validity

Use the [updater functions](#store-updating--onchange) for store changes from widgets.

For best performance in non-scalar widgets use the [HOCs](https://reactjs.org/docs/higher-order-components.html) `extractValue`, `extractValidity` for getting the values, together with [memo](#memo--isequal).

General typings of the store:

```typescript jsx
import { UIStoreType } from '@ui-schema/ui-schema/UIStore'
```

### UIStoreProvider

Saves and provides the `store`, `onChange` and `schema`.

- Provider: `UIStoreProvider`
- Hook: `useUI`
    - returns: `{store: UIStore, onChange: function, schema: OrderedMap}`
- HOC to get the current values by `storeKeys` for one widget:
    - `extractValue` passes down: `value`, `internalValue`, `onChange`
    - `extractValidity` passes down: `validity`, `onChange`
- Properties:
    - `store`: `UIStore` the immutable record storing the current ui generator state
    - `onChange`: `function(storeKeys, scopes, updater, deleteOnEmpty, type): void` a function capable of updating the saved store
    - `schema`: `OrderedMap` the full schema as an immutable map

See [core functions to update store](#store-updating--onchange).

Example creating the provider:

```js
import React from "react";
import {UIStoreProvider} from "@ui-schema/ui-schema";

const CustomProvider = ({store, onChange, schema, children}) => {
    return <UIStoreProvider
        store={store}
        onChange={onChange}
        schema={schema}
        children={children}
    />;
}
```

Example Hook:

```js
import React from "react";
import {isInvalid, useUI} from "@ui-schema/ui-schema";

const Comp = ({storeKeys, ...props}) => {
    const {
        onChange, // also passed down in props: `props.onChange`
        store,
    } = useUI();

    store.getValidity();  // better to use the HOC `extractValidity`
    store.getInternals(); // better to use the HOC `extractValue`
    store.getValues();    // better to use the HOC `extractValue`

    let invalid = isInvalid(validity, storeKeys, false); // Map, List, boolean: <if count>

    return null;// e.g. widget or plugin
};
```

#### Store Updating / onChange

The UIGenerator needs a `onChange` function which is used from within widgets to update the store, an instance of the `UIStore` immutable record.

See [simplest Text Widget](/docs/widgets#simplest-text-widget) for a basic widget example.

The `onChange` is responsible to update different parts of the [store](#uistore), individually or all at once. It can be used to update validity, values and non-standard elements with only one execution of `setStore` - which can be fully controlled by the using component.

Parameters:

- `storeKeys`: `List<string | number>`, the keys of the value to update
- `scopes`: `string[]`, which scope to update, uses singular: `value`, `valid`, `internal`
- `updater`, a function receiving the scope values and returning the updated values
    - `function({value, valid, internal}: {value: any, valid: any, internal: any}): {value: any, valid: any, internal: any}`
- `deleteOnEmpty`: `boolean | undefined`, if the property should be deleted at all, treating [empty like in required HTML-inputs](/docs/schema#required-keyword)
    - from widgets the required property/keyword turns this to `true`
    - `integers`/`numbers` are treated al
- `type`: `string | undefined`, the type of the value, may be unknown on some edge cases (like only updating validity), is needed for `deleteOnEmpty`

Does not return anything.

```js
import React from 'react';
import {UIGenerator, createOrderedMap, createStore} from '@ui-schema/ui-schema';
import {storeUpdater} from '@ui-schema/ui-schema/UIStore/storeUpdater';
import {widgets} from '@ui-schema/ds-material';

const Demo = () => {
    const [store, setStore] = React.useState(() => createStore(createOrderedMap({})));

    const onChange = React.useCallback((storeKeys, scopes, updater, deleteOnEmpty, type) => {
        setStore(prevStore => {
            return storeUpdater(storeKeys, scopes, updater, deleteOnEmpty, type)(prevStore)
        })
    }, [setStore])

    return <UIGenerator
        store={store}
        onChange={onChange}
        // add other props here
    />
};
```

##### storeUpdater

The internal function to update the store, implements the `deleteOnEmpty` logic and handling the execution of `updater` and the updating of the store with the results.

Sets initial `OrderedMap` or `List` when changing nested elements - but the parent doesn't exist, thus forcing `object` to be `OrderedMap` or `List`, needed for comfortable `onChange` inside e.g. `GenericList` and drag 'n drops.

Returns a function which must receive the current store, it will return the updated store.

See example above on how to use it, additionally you can intercept the prevStore and nextStore through wrapping the function in logic.

```js
import {storeUpdater} from '@ui-schema/ui-schema/UIStore/storeUpdater';
```

## UIMetaProvider

Saves additional functions and meta-data for the ui generator.

- Provider: `UIMetaProvider`
- Hook: `useUIMeta`
- HOC: `withUIMeta`
- Properties/ContextData:
    - `widgets` JS-object
    - `showValidity` boolean
    - `t` : `function` translator function, see [translation](/docs/localization#translation)

Example Hook:

```js
import React from "react";
import {useUIMeta} from "@ui-schema/ui-schema";

const Comp = () => {
    const {widgets} = useUIMeta();

    const RootRenderer = widgets.RootRenderer;
    return <RootRenderer {...props}/>
};
```

Example HOC, recommended to use memo:

```js
import React from "react";
import {withUIMeta, memo} from "@ui-schema/ui-schema";

const Comp = withUIMeta(
    memo(
        ({widgets, showValidity, t, ...props}) => {
            const RootRenderer = widgets.RootRenderer;
            return <RootRenderer {...props}/>
        }
    )
);
```

### UIProvider

Provider to position the actual editor in any position, just pass everything down to the provider, the UIRootRenderer connects to the provider automatically. Recommended to add memoized abstraction layers between HTML and provider.

```js
import React from "react";
import {
    UIProvider, UIRootRenderer,
    isInvalid, useUI,
} from "@ui-schema/ui-schema";

const CustomFooter = ({someCustomProp}) => {
    // access the editor context, also available e.g.: useSchemaWidgets, useSchemaData
    const {store} = useUI();

    return <p style={{fontWeight: someCustomProp ? 'bold' : 'normal'}}>
        {isInvalid(store.getValidity()) ? 'invalid' : 'valid'}
    </p>
}

const CustomEditor = ({someCustomProp, ...props}) => (
    <UIProvider {...props}>
        <div>
            <UIRootRenderer schema={props.schema}/>
            <div>
                <CustomFooter someCustomProp={someCustomProp}/>
            </div>
        </div>
    </UIProvider>
);
```

