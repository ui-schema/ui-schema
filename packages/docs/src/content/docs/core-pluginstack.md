# Plugins & PluginStack

Plugins are wrapped around each widget/json-schema level and can be used to add logic to all following. Each plugin should decide if it should do something according to it's props/schema.

There are two types of plugins: [Widget Plugins](#widget-plugins) and [Simple Plugins](#simple-plugins).

See the list of [included plugins](/docs/plugins).

### Widget Plugins

React components as Plugins, e.g. work schema-driven, creating functionality around the schema - which may influence the validations. If possible, use a simple plugin, as they don't introduce a new react component level.

```typescript jsx
// typing:
import { PluginProps, PluginType } from "@ui-schema/ui-schema/PluginStack/Plugin"
```

### Simple Plugins

Simple plugins are just functions, they can't change the React render-flow, but can change any `props`.

Included simple plugins are e.g. the [validator plugins](/docs/plugins#validation-plugins), [renamed from `ValidatorPlugin` to `PluginSimple` in `0.3.0`](https://github.com/ui-schema/ui-schema/issues/130).

Executed inside the widget plugin [`PluginSimpleStack`](#pluginsimplestack).

```typescript
// typing:
import { PluginSimple } from "@ui-schema/ui-schema/PluginSimpleStack"
```

## PluginStack

Entry point into widget and plugin rendering, uses the `props` to start the render tree of all registered plugins, with finally the actual widget by [`WidgetRenderer`](/docs/core-renderer#widgetrenderer).

When ever you need to build an own `array` or `object` widget, you need to handle the rendering of `properties` or `items` schemas.

This is easily done by starting a new `PluginStack` - a new schema-level so to say.

`props` passed to the `PluginStack` are received by it's child(ren), some - like `widgets` overwrite the `UIMetaStore` values for a specific `PluginStack` and when passed down also nested ones (e.g. `widgets` is also passed down further levels through `ObjectRenderer`).

See [PluginStack typings](https://github.com/ui-schema/ui-schema/blob/master/packages/ui-schema/src/PluginStack/PluginStack.d.ts) for more details about `props`.

Overwrite `props` rules for any `widgets.widgetPlugins` plugin:

- `props` passed directly to `PluginStack` overwrite any other, except [`PluginStackInjectProps`](https://github.com/ui-schema/ui-schema/blob/master/packages/ui-schema/src/PluginStack/PluginStack.d.ts)
- [`UIMetaContext`](/docs/core-meta) are overwritten by any other, added to every plugin stack by default
- [`UIConfigContext`](/docs/core-store#uiconfigcontext) is overwriting only the `UIMetaContext`, added to every plugin stack by default
- [`UIStoreContext`](/docs/core-store#uistoreprovider) must be added from within plugins, but only extracted using `storeKeys` as [interface `WithValue`](https://github.com/ui-schema/ui-schema/blob/master/packages/ui-schema/src/UIStore/UIStoreProvider.tsx) on a schema level, [done by `ExtractStorePlugin`](/docs/plugins#extractstoreplugin)

### Typescript Custom PluginStack props

`PluginStack` allows to specify the needed `props`, when using `WidgetOverride` it automatically types those props. All `props` passed to `PluginStack` are passed down, but the typing is stricter since `0.3.0`.

```typescript tsx
// for generic "allows any props" `PluginStack`,
// like the default before 0.3.0
<PluginStack<{ [k: string]: any }>
/>

// explicit telling of allowed/expected-to-work `props`:
<PluginStack<{ readOnly: boolean }>
    showValidity={showValidity}
    storeKeys={storeKeys.push('city') as StoreKeys}
    schema={schema.getIn(['properties', 'city']) as unknown as StoreSchemaType}
    parentSchema={schema}
    level={1}
    readOnly={false}
    noGrid={false}
/>

// the typing of `TableRowRenderer` must be: `React.ComponentType<WidgetProps & TableRowProps>`:
<PluginStack<TableRowProps>
    // `PluginStack` props:
    storeKeys={storeKeys.push(i as number)}
    schema={itemsSchema}
    parentSchema={schema}
    level={level}
    isVirtual={isVirtual}
    noGrid
    widgets={widgets}

    WidgetOverride={TableRowRenderer}

    // `TableRowsProps`:
    setPage={setPage}
    showRows={isVirtual ? undefined : rows}
    uid={uid}
    listSize={listSize}
    dense={dense}
/>
```

### Example PluginStack Custom Form

Full custom form as example on how to use the `PluginStack` directly, also checkout `applyPluginStack` for further usages.

```json
{
    "type": "object",
    "widget": "UnitCalcDummy",
    "properties": {
        "unit": {
            "type": "string",
            "widget": "Select",
            "enum": [
                "g",
                "kg",
                "l",
                "ml"
            ]
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
import { memo } from '@ui-schema/ui-schema/Utils/memo'
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { StoreKeys, extractValue, WithValue } from '@ui-schema/ui-schema/UIStore'
import { PluginStack } from '@ui-schema/ui-schema/PluginStack'

const UnitCalcDummyBase: React.ComponentType<WidgetProps & WithValue> = (
    {
        showValidity, schema, level, widgets, ...props
    }
) => {
    const {storeKeys, value} = props
    const readOnly = schema.get('readOnly') as boolean | undefined

    // for getting the value in `object` renderers, you must use `extractValue`/`memo`
    console.log('value-unit', value?.get('unit'))
    console.log('value-value', value?.get('value'))

    return <>
        <h2>Unit Calc</h2>

        <PluginStack<{ readOnly: boolean | undefined }>
            // from PluginStack, required
            storeKeys={storeKeys.push('unit') as StoreKeys}
            schema={schema.getIn(['properties', 'unit']) as StoreSchemaType}
            parentSchema={schema}
            // from PluginStack, optional
            level={level + 1}

            // additional props we want to override/add
            showValidity={showValidity}
            readOnly={readOnly}
            widgets={widgets}
            noGrid // turning grid off, or use e.g. `schema.setIn(['view', 'noGrid'], true)`
        />

        <span>
            {' @ '}
        </span>

        <PluginStack<{ readOnly: boolean | undefined, isKg: boolean }>
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

export const UnitCalcDummy: React.ComponentType<WidgetProps> = extractValue(memo(UnitCalcDummyBase))
```

> see the more in-depth docs about the [widget composition concept](/docs/widgets-composition)

## applyPluginStack

Function to build autowiring components, which are fully typed with the actual widget properties, useful for full custom UIs or complex widgets.

The created component applies the typescript definitions of the actual widget, but omits those injected by `PluginStack`.

Since `0.4.0-alpha.1`, this function also applies [`memo`](/docs/core-utils#memo--isequal) to the final component.

> todo: currently omits properties (also the `PluginStack`), which are possible because of the used plugins,
> this should be optimized to automatically suggest the props of currently applied `widgets.widgetPlugins` (when possible)

```typescript jsx
import React from 'react'
import Grid from '@mui/material/Grid'
import { createOrderedMap } from '@ui-schema/ui-schema/Utils/createMap'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { StringRenderer } from '@ui-schema/ds-material/Widgets/TextField'
import { applyPluginStack } from '@ui-schema/ui-schema/applyPluginStack'

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

const EditorStub = () => {
    const [store, setStore] = React.useState(() => createStore(OrderedMap()))

    const onChange = React.useCallback((actions) => setStore(storeUpdater(actions)), [setStore])

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
            isRoot // new prop since `0.4.0-alpha.1`
            schema={schema}
        />
    </UIProvider>
}
```

## injectPluginStack

> ⚠ new since `v0.4.0-alpha.1`

Utility to wire-up wrapper components inside the performance-area of the `PluginStack` and not of the parent component (and additionally inside the `ErrorBoundary` of the `PluginStack`).

Similar to `applyPluginStack`, but this function allows to wrap the whole `PluginStack` with another component - and optionally supports the same `CustomWidget` part with a second param.

This function also applies [`memo`](/docs/core-utils#memo--isequal) to the final component.

> this function is typesafe, and works like [`applyPluginStack`](#applypluginstack) in that matter

```typescript jsx
import React from 'react'
import { GridContainer } from '@ui-schema/ds-material/GridContainer'
import { applyPluginStack } from '@ui-schema/ui-schema/applyPluginStack'

// wire up:
const GridStack = injectPluginStack(GridContainer)

const Stepper = injectPluginStack(GridContainer, WidgetStepper)

const FancyWidget = () => {
    // somewhere below `UIStoreProvider`
    // here as the "root schema" renderer:
    return <>
        <GridStack
            isRoot
            schema={customSchema}
        />
    </>
}
```

## NextPluginRenderer

Used for plugin rendering, internally uses `getNextPlugin`, see: [creating plugins](#create-plugins).

> Use `getNextPlugin` directly instead of this component or use `NextPluginRendererMemo` when needed

### NextPluginRendererMemo

Same as NextPluginRenderer, but as memoized function, used in e.g. object widgets when they are using [useUI](/docs/core-store#uistoreprovider), see: [creating plugins](#create-plugins).

## PluginSimpleStack

Executes the simple plugins, one after another.

Can be used to build own / further simple plugin stacks:

```javascript
import {handlePluginSimpleStack} from '@ui-schema/ui-schema/PluginSimpleStack'

export const PluginSimpleStack = ({currentPluginIndex, ...props}) => {
    const next = currentPluginIndex + 1;
    const Plugin = getNextPlugin(next, props.widgets)

    // replace the second parameter with your plugin simple stack:
    return <Plugin {...handlePluginSimpleStack(props, props.widgets.pluginSimpleStack)} currentPluginIndex={next}/>;
}
```

Example Binding:

```javascript
import {PluginSimpleStack} from '@ui-schema/ui-schema';

const widgets = {
    widgetPlugins: [
        // ... other plugins
        PluginSimpleStack, // executes the `pluginSimpleStack`
        // ... other plugins
    ],
    pluginSimpleStack: [],
};
```

## Create Plugins

### Create a Simple Plugin

A simple plugin is a JS-Object which contains multiple functions that can be used for e.g. validation. They are not a React component, they can not control the render-flow or using hooks!

Each function receives the props the actual component receives, the return object of `noHandle` and `handle` is shallow-merged into the current props. Adding e.g. new or changed properties to the actual widget.

- `should`: optional checker if the `handle` function should do something
- `noHandle`: gets run when it `should not` be handling, must return `object`
- `handle`: only run when it `should`, must return `object`

```js
const SomeValidator = {
    should: (props) => {
        return shouldValidate ? true : false;
    },
    noHandle: (props) => ({newProp: false}),
    handle: ({schema, value, errors, valid}) => {
        let type = schema.get('type');
        if(!checkValueExists(type, value)) {
            valid = false;
            errors = errors.addError(ERROR_NOT_SET);
        }
        return {errors, valid, required: true}
    }
};
```

Design system binding in `widgets.pluginSimpleStack`, **and currently hardcoded** in `validateSchema`.

### Create a Widget Plugin

Each plugin can use `props` and the schema to change or add properties to the final widget, change the render behaviour, do asynchronous actions or whatever React and JS allows.

Creating a plugin like:

```js
import React from "react";
import {NextPluginRenderer, getNextPlugin} from "@ui-schema/ui-schema/PluginStack";

const NewPlugin = ({currentPluginIndex, ...props}) => {
    // doing some logic
    const newProp = props.schema.get('keyword') ? 'success' : 'error';

    // keep rendering the stack or do something else

    const next = currentPluginIndex + 1;
    const Plugin = getNextPlugin(next, props.widgets)

    // even thus more code, it's better to use `getNextPlugin` (instead of `NextPluginRenderer`)
    return <Plugin {...props} currentPluginIndex={next}/>

    // but where needed, use a memoized next plugin renderer:
    return <NextPluginRendererMemo {...props} newProp={newProp}/>;
};

export {NewPlugin}
```

- `{currentPluginIndex, ...props}` prop signature of each plugin
- `currentPluginIndex` index/current position in stack
- `props` are the props which are getting pushed to the `Widget`
- recommended: use `getNextPlugin()` for getting the next to render plugin
    - automatically render the plugins nested
    - `newProp` is available in the widget and the next plugins

Design system binding in `widgets.widgetPlugins`.

See also:

- [how to add custom plugins to the binding](/docs/widgets#adding--overwriting-widgets)
- [replace `ExtractStorePlugin`](/docs/plugins#extractstoreplugin)
- [`UIStoreContext`/`UIConfigContext`](/docs/core-store) and [`UIMetaContext`](/docs/core-meta) hooks, HOCs and utils can be used to access, update, delete, move any data, keep [performance](/docs/performance) in mind!
