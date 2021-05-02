# UI-Schema Core

Components and functions exported by `@ui-schema/ui-schema` for usage within design systems, plugins and widgets.

The props passed to the `UIGenerator`, `UIGeneratorNested` are accessible through providers.

Basic [flowchart](#flowchart) of the UIGenerator to Widget logic.

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

## Main UI Generator & Renderer

### UIGenerator

Main entry point for every new UI Schema generator, starts the whole schema and renders the RootRenderer with `UIRootRenderer`, **checkout the [quick-start](/quick-start)** for a full example!

### UIGeneratorNested

> **deprecated**, use [PluginStack](#pluginstack) instead, this component may be removed in `0.3.0` as it seems no longer needed with the now optimized logic/component flow

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

The `RootRenderer` is rendered in a memo component, starts the first rendering of a widget, this is the `children` of `RootRenderer`, done with [PluginStack](#pluginstack).

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

With this variable you get the used cache key in the `localStorage`

```jsx
import {schemaLocalCachePath} from '@ui-schema/ui-schema/UIApi/UIApi'
```

## Widget Renderer

Components responsible for the actual rendering of plugins and then finally the widget.

### PluginStack

Entry point into widget and plugin rendering, uses the `props` to start the render tree of all registered plugins, with finally the actual widget by [`WidgetRenderer`](#widgetrenderer).

When ever you need to build an own `array` or `object` widget, you need to handle the rendering of `properties` or `items` schemas.

This is easily done by starting a new `PluginStack` - a new schema-level so to say.

`props` passed to the `PluginStack` are received by it's child(ren), some - like `widgets` overwrite the `UIMetaStore` values for a specific `PluginStack` and when passed down also nested ones (e.g. `widgets` is also passed down further levels through `ObjectRenderer`).

See [PluginStack typings](https://github.com/ui-schema/ui-schema/blob/master/packages/ui-schema/src/PluginStack/PluginStack.d.ts) for more details about `props`.

```json
{
    "type": "object",
    "widget": "UnitCalcDummy",
    "properties": {
        "unit": {
            "type": "string",
            "widget": "Select",
            "enum": ["g", "kg", "l", "ml"]
        },
        "value": {
            "type": "number"
        }
    }
}
```

Very basic `object` widget that renders two different property schemas in custom plugin stacks, enabling custom formatting/transformations depending on `object` data.

In production/for-others it should be a bit more flexible, e.g. handling additional or different namings of properties.

```typescript jsx
import { extractValue, memo, PluginStack, WidgetProps, WithValue } from '@ui-schema/ui-schema'

let UnitCalcDummy: React.ComponentType<WidgetProps & WithValue> = (
    {
        showValidity, schema, level, widgets, ...props
    }
) => {
    const {storeKeys, value} = props
    const readOnly = schema.get('readOnly')

    // for getting the value in `object` renderers, you must use `extractValue`/`memo`
    console.log('value-unit', value?.get('unit'))
    console.log('value-value', value?.get('value'))

    return <>
        <h2>Unit Calc</h2>

        <PluginStack
            // from PluginStack, required
            storeKeys={storeKeys.push('unit')}
            schema={schema.getIn(['properties', 'unit'])}
            parentSchema={schema}
            // from PluginStack, optional
            level={level + 1}

            // additional props we want to override/add
            showValidity={showValidity}
            readOnly={readOnly}
            widgets={widgets}
            noGrid // turning of grid, or use `schema.getIn(['view', 'noGrid'])`
        />

        <span>
            {' @ '}
        </span>

        <PluginStack
            // from PluginStack, required
            storeKeys={storeKeys.push('value')}
            schema={schema.getIn(['properties', 'value'])}
            parentSchema={schema}

            // from PluginStack, optional
            level={level + 1}

            // additional props we want to override/add
            showValidity={showValidity}
            readOnly={readOnly}
            widgets={widgets}
            noGrid

            // is received by the `number` widget
            isKg={value?.get('unit') === 'kg'}
        />
    </>
}

UnitCalcDummy = extractValue(memo(UnitCalcDummy))

export { UnitCalcDummy }
```

> see the more in-depth docs about the [widget composition concept](/docs/widgets-composition)

### applyPluginStack

Function to build autowiring components, which are fully typed with the actual widget properties, useful for full custom UIs or complex widgets.

The created component applies the typescript definitions of the actual widget, but omits those injected by `PluginStack`.

> todo: currently omits properties (also the `PluginStack`), which are possible because of the used plugins,
> this should be optimized to automatically suggest the props of currently applied `widgets.pluginStack` (when possible)

```typescript jsx
import React from 'react'
import {List} from 'immutable'
import Grid from '@material-ui/core/Grid'
import {createOrderedMap} from '@ui-schema/ui-schema/Utils/createMap'
import {WidgetProps} from '@ui-schema/ui-schema/Widget'
import {StringRenderer} from '@ui-schema/ds-material/Widgets/TextField'
import {applyPluginStack} from '@ui-schema/ui-schema/applyPluginStack'

// using `applyPluginStack`, this widget is fully typed
// with the actual props of the widget component `StringRenderer`
const WidgetTextField = applyPluginStack(StringRenderer)

// custom group component, needed to also validate the root level
// this one works for objects
let CustomGroup: React.ComponentType<WidgetProps> = (props) => {
    const {
        schema, storeKeys, level,
        // errors for the root/current schema level
        errors, valid,
    } = props

    return <Grid container dir={'columns'} spacing={4}>
        <WidgetTextField
            level={level + 1}
            storeKeys={storeKeys.push('name')}
            schema={schema.getIn(['properties', 'name'])}
            parentSchema={schema}

            // this property comes from `StringRenderer`:
            multiline={false}
        />
    </Grid>
}
// wiring this component, to use for `type: object` schema levels
CustomGroup = applyPluginStack(CustomGroup)

const freeFormSchema = createOrderedMap({
    type: 'object',
    properties: {
        name: {
            type: 'string',
        },
    },
})

const rootStoreKeys = List()
const EditorStub = () => {
    const [store, setStore] = React.useState(() => createStore(OrderedMap()))

    const onChange = React.useCallback((...action) => setStore(storeUpdater(...action)), [setStore])

    // use the `UIProvider` to skip the rendering of `RootRenderer`
    return <UIProvider
        store={store}
        onChange={onChange}
        schema={freeFormSchema}
        /* widgets={} showValidity={} t={} */
    >
        {/*
          * this could be in any component below `UIProvider`,
          * thus you can nest it in own HTML, which can be in `PureComponents`:
          * using `memo`, they don't re-render even when `store` has changed
          */}
        <CustomGroup
            level={0}
            storeKeys={rootStoreKeys}
            schema={freeFormSchema}
            parentSchema={freeFormSchema}
        />
    </UIProvider>
}
```

### NextPluginRenderer

Used for plugin rendering, see: [creating plugins](/docs/plugins#creating-plugins).

Handles the switching between `WidgetRenderer` and a `Plugin` (if there is still one which was not executed).

#### NextPluginRendererMemo

Same as NextPluginRenderer, but as memoized function, used in e.g. object widgets when they are using [useUI](#uistoreprovider), see: [creating plugins](/docs/plugins#creating-plugins).

### WidgetRenderer

Finds the actual widget in the mapping by the then defined schema, renders the widget and passes down all accumulated props (e.g. everything the plugins have added).

If no widget is fund, renders nothing / `null`, but the plugins may have already rendered something! (like the grid)

Executes `onErrors` for that schema level, when `errors` have changed and `onErrors` was specified.

**Handles** removing props, before rendering the actual widget component. For performance reasons removes these `props`:

- `value` is removed for `schema.type` `array` or `object`
- `internalValue` is removed for `schema.type` `array` or `object`
- `requiredList` is removed for every type

### ObjectGroup

Component - not a widget - for custom UI generation and handling `type=object` schema levels - without needing to nest everything.

Use the property `onSchema` to get the maybe-changed schema up to the parent component, then reuse that for your other widgets.

To get the errors of that schema level, use `onErrors` from [`WidgetRenderer`](#widgetrenderer).

```typescript jsx
const freeFormSchema = OrderedMap()

const WidgetTextField = applyPluginStack(StringRenderer)

const FreeFormEditor = () => {
    const [store, setStore] = React.useState(() => createStore(OrderedMap()))
    const [schema, setSchema] = React.useState<StoreSchemaType>(() => freeFormSchema)

    const onChange = React.useCallback((...update) => setStore(storeUpdater(...update)), [setStore])

    return <UIProvider
        schema={freeFormSchema}
        store={store}
        onChange={onChange}
        // widgets={customWidgets}
        // showValidity={showValidity}
        // t={browserT}
    >
        <ObjectGroup
            storeKeys={storeKeys}
            schema={freeFormSchema} parentSchema={undefined}
            onSchema={(schema) => setSchema(schema)}
        >
            <Grid container dir={'columns'} spacing={4}>
                <WidgetTextField
                    level={1}
                    storeKeys={storeKeys.push('name') as StoreKeys}
                    schema={schema.getIn(['properties', 'name']) as unknown as StoreSchemaType}
                    parentSchema={schema}

                    // using `applyPluginStack`, this free-form widget is fully typed
                    // with the actual props of the widget component
                    multiline={false}
                />
            </Grid>
        </ObjectGroup>

    </UIProvider>
}
```

### ObjectRenderer

Widget used automatically for `type=object` that do not have a custom `widget`.


## Utils

### beautify

See [localization text-transform](/docs/localization#text-transform), this is the base function for beautifying.

```js
import {beautify} from '@ui-schema/ui-schema/Utils/beautify'
```

### createStore

Creates the initial store out of passed in values.

```js
import {createStore} from '@ui-schema/ui-schema/UIStore'
import {createOrderedMap} from '@ui-schema/ui-schema/Utils/createOrderedMap'

const [data, setStore] = React.useState(() => createStore(createOrderedMap(initialData)));
```

### createEmptyStore

Creates an empty store out of the schema type.

```js
import {useImmutable} from '@ui-schema/ui-schema/Utils/useImmutable'

const [data, setStore] = React.useState(() => createEmptyStore(schema.get('type')));
```

### moveItem

Helper for moving an item inside a `List`/`array`, useful for moving up/down inside a list widget.

```js
import {useImmutable} from '@ui-schema/ui-schema/Utils/useImmutable'

// moving "up" in an sortable list
onChange(
    storeKeys, ['value', 'internal'],
    ({value, internal}) => ({
        value: moveItem(value, index, index - 1),
        internal: moveItem(internal, index, index - 1),
    }),
    deleteOnEmpty,
    'array',
)

// moving "down" in an sortable list
onChange(
    storeKeys, ['value', 'internal'], ({value, internal}) => ({
        value: moveItem(value, index, index + 1),
        internal: moveItem(internal, index, index + 1),
    }),
    deleteOnEmpty,
    'array',
)
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

### sortScalarList

Sorts `string` and `number` values inside a `List` in `asc` order, useful for better "is-same-as-initial" when seleting enum values:

```js
import {sortScalarList} from '@ui-schema/ui-schema/Utils/sortScalarList';

onChange(
    storeKeys, ['value'],
    ({value: val = List()}) =>
        ({
            value: sortScalarList(
                val.contains(enum_name) ?
                    val.delete(val.indexOf(enum_name)) :
                    val.push(enum_name)
            ),
        }),
    required,
    type,
)
```
### createMap

Deep change directly from `{}` or `[]` to `Map`/`List` structures:

```js
import {createMap} from '@ui-schema/ui-schema/Utils/createMap'

let dataMap = createMap({});
```

### createOrderedMap

Deep change directly from `{}` or `[]` to `OrderedMap`/`List` structures:

```js
import {createOrderedMap} from '@ui-schema/ui-schema/Utils/createOrderedMap'

let dataMap = createOrderedMap({});
```

### fromJSOrdered

Function to deep change an object into an ordered map, will change the objects properties but not the root-object.

```js
import {OrderedMap} from 'immutable'
import {fromJSOrdered} from '@ui-schema/ui-schema/Utils/fromJSOrdered'

let dataMap = new OrderedMap(fromJSOrdered({}));
```

### useImmutable

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

## Flowchart

[![flowchart](/Flowchart-SchemaEditor.svg)](https://ui-schema.bemit.codes/Flowchart-SchemaEditor.svg)
