# UI-Schema Core

Components and functions exported by `@ui-schema/ui-schema` for usage within design systems, plugins and widgets.

The props passed to the `UIGenerator`, `UIGeneratorNested` are accessible through providers.

Basic [flowchart](#flowchart) of the UIGenerator to Widget logic.

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

const CustomProvider = ({store, onChange, schema, children}) =>{
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

- `storeKeys`: `List<string>`, the keys of the value to update
- `scopes`: `string[]`, which scope to update, uses singular: `value`, `valid`, `internal`
- `updater`, a function receiving the scope values and returning the updated values
    - `function({value, valid, internal}: {value: any, valid: any, internal: any}): {value: any, valid: any, internal: any}`
- `deleteOnEmpty`: `boolean | undefined`, if the property should be deleted at all, treating [empty like in required HTML-inputs](/docs/schema#required-keyword)
    - from widgets the required property/keyword turns this to `true`
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

Returns a function which must receive the current store and will return the updated store.

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

Example HOC, recommended for memo usage:

```js
import React from "react";
import {withUIMeta} from "@ui-schema/ui-schema";

const Comp = withUIMeta(
    React.memo(
        ({widgets, showValidity, t, ...props}) => {
            const RootRenderer = widgets.RootRenderer;
            return <RootRenderer {...props}/>
        }
    )
);
```

## Main UI Generator & Renderer

### UIGenerator

Main entry point for every new UI Schema generator,  starts the whole schema and renders the RootRenderer with `UIRootRenderer`.

### UIGeneratorNested

> **deprecated**, use [PluginStack](#pluginStack) instead, this component may be removed in `0.3.0` as it seems no longer needed with the now optimized logic/component flow

Automatic nesting ui generator, uses the parent contexts, starts a UIGenerator at schema-level with `UIRootRenderer`.

It works with adding the wanted schema and it's storeKeys, this automatically enables data-binding by `UIRootRenderer`.

- allows overwriting `showValidity`, `widgets`, `t` easily by attaching itself to the parent's meta-provider (not store-provider).
- data/store must not be pushed through
- any property that `UIGeneratorNested` receives is available within plugins and widgets

```js
import React from "react";
import {UIGeneratorNested} from "@ui-schema/ui-schema";

const Box = ({schema, storeKeys, level, showValidity}) => {
    // create a simple custom Object handler for some style, but let the core handle everything

    // can also be that schema/storeKeys are calculated by some other values here, rendering what ever schema (and not only type: object`)
    return <div className="fancy-box">
        <UIGeneratorNested
            showValidity={showValidity}
            storeKeys={storeKeys}
            schema={schema}
            level={level}
            noGrid // not a provider property, so pushed to the pluginStack, available for the GridHandler
        />
    </div>
};
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
            <UIRootRenderer/>
            <div>
                <CustomFooter someCustomProp={someCustomProp}/>
            </div>
        </div>
    </UIProvider>
);
```

### UIRootRenderer

Connects to the current context and uses the schema the first time, renders the `widgets.RootRenderer`.

The `RootRenderer` is rendered in a memo component, starts the first rendering of a widget, this is the `children` of `RootRenderer`, done with [PluginStack](#pluginStack).

## UIApi

> ❗ Only for loading schemas currently

Add the `UIApiProvider`, should be above all `UIGenerator` to not load the same schema multiple times.

The `loadSchema` property needs a function which accepts the url and must return the schema in json. If the api fails, either don't catch or re-throw the error. This way the internal caching can correctly allow retries for errors.

```jsx
const loadSchema = (url) => {
    return fetch(url).then(r => r.json())
}
const Provider = ({children}) => <UIApiProvider
    loadSchema={loadSchema}
    /* disables localStorage cache of e.g. loaded schemas */
    noCache={false}
>
    {children}
</UIApiProvider>
```

## Widget Renderer

### PluginStack

Entry point into widget and plugin rendering, uses the `props` to start the render tree of all registered plugins, with finally the actual widget.

### NextPluginRenderer

Used for plugin rendering, see: [creating plugins](/docs/plugins#creating-plugins).

Handles the switching between `WidgetRenderer` and a `Plugin` (if there is still one which was not executed).

#### NextPluginRendererMemo

Same as NextPluginRenderer, but as memoized function, used in e.g. object widgets when they are using [useUI](#uistoreprovider), see: [creating plugins](/docs/plugins#creating-plugins).

### WidgetRenderer

Finds the actual widget in the mapping by the then defined schema, renders the widget and passes down all accumulated props (e.g. everything the plugins have added).

If no widget is fund, renders nothing / `null`, but the plugins may have already rendered something! (like the grid)

## Utils

### createStore

Creates the initial store out of passed in values.

```js
const [data, setStore] = React.useState(() => createStore(createOrderedMap(initialData)));
```

### createEmptyStore

Creates an empty store out of the schema type.

```js
const [data, setStore] = React.useState(() => createEmptyStore(schema.get('type')));
```

### memo / isEqual

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

### mergeSchema

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

### createMap

```js
let dataMap = createMap({});
```

### createOrderedMap

```js
let dataMap = createOrderedMap({});
```

### fromJSOrdered

Function to deep change an object into an ordered map, will change the objects properties but not the root-object.

```js
let dataMap = new OrderedMap(fromJSOrdered({}));
```

## Flowchart

[![flowchart](/Flowchart-SchemaEditor.svg)](https://ui-schema.bemit.codes/Flowchart-SchemaEditor.svg)
