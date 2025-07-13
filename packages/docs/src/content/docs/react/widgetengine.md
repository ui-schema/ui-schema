---
docModule:
    package: '@ui-schema/react'
    modulePath: "react/src/"
    files:
        - "Widget/*"
        - "WidgetEngine/*"
---

# WidgetEngine

Each JSON Schema level is rendered individually, a new level is started with the `WidgetEngine`. In the root level it starts the whole rendering, otherwise when using custom rendering and in object/array widgets the `WidgetEngine` is used to render sub-schema, like object properties and array items.

The `WidgetEngine` needs to know its location in the value tree, the `storeKeys`, and the `schema` for the level.

Plugins are wrapped around each widget/json-schema level and can be used to add logic to all following. Each plugin should decide if it should do something according to it's props/schema.

## WidgetEngine

Entry point into widget and plugin rendering, uses the `props` to start the render tree of all registered plugins, with finally the actual widget by [`WidgetRenderer`](/docs/core-renderer#widgetrenderer).

When ever you need to build an own `array` or `object` widget, you need to handle the rendering of `properties` or `items` schemas.

This is easily done by starting a new `PluginStack` - a new schema-level so to say.

`props` passed to the `PluginStack` are received by it's child(ren), some - like `widgets` overwrite the `UIMetaStore` values for a specific `PluginStack` and when passed down also nested ones (e.g. `widgets` is also passed down further levels through `ObjectRenderer`).

See [PluginStack typings](https://github.com/ui-schema/ui-schema/blob/master/packages/ui-schema/src/PluginStack/PluginStack.d.ts) for more details about `props`.

Overwrite `props` rules for any `widgets.widgetPlugins` plugin:

- `props` passed directly to `PluginStack` overwrite any other, except [`PluginStackInjectProps`](https://github.com/ui-schema/ui-schema/blob/master/packages/ui-schema/src/PluginStack/PluginStack.d.ts)
- [`UIMetaContext`](/docs/core-meta) are overwritten by any other, added to every plugin stack by default
- [`UIConfigContext`](/docs/core-store#uiconfigcontext) is overwriting only the `UIMetaContext`, added to every plugin stack by default
- [`UIStoreContext`](/docs/core-store#uistoreprovider) are extracted using `storeKeys`

### Typescript Custom PluginStack props

`PluginStack` allows to specify the needed `props`, when using `WidgetOverride` it automatically types those props. All `props` passed to `PluginStack` are passed down, but the typing is stricter since `0.3.0`.

```typescript tsx
// for generic "allows any props" `PluginStack`,
// like the default before 0.3.0
<PluginStack<{ [k: string]: any }>
/ >

// explicit telling of allowed/expected-to-work `props`:
<PluginStack<{ readOnly: boolean }>
    showValidity = {showValidity}
storeKeys = {storeKeys.push('city') as StoreKeys}
schema = {schema.getIn(['properties', 'city']) as unknown as UISchemaMap}
parentSchema = {schema}
readOnly = {false}
noGrid = {false}
/>

// the typing of `TableRowRenderer` must be: `React.ComponentType<WidgetProps & TableRowProps>`:
< PluginStack<TableRowProps>
// `PluginStack` props:
storeKeys = {storeKeys.push(i as number)}
schema = {itemsSchema}
parentSchema = {schema}
isVirtual = {isVirtual}
noGrid
binding = {widgets}

WidgetOverride = {TableRowRenderer}

// `TableRowsProps`:
setPage = {setPage}
showRows = {isVirtual ? undefined : rows}
uid = {uid}
listSize = {listSize}
dense = {dense}
/>
```

### Example PluginStack Custom Form

Full custom form as example on how to use the `PluginStack` directly, also checkout `applyWidgetEngine` for further usages.

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
import { memo } from '@ui-schema/react/Utils/memo'
import { UISchemaMap } from '@ui-schema/ui-schema/CommonTypings'
import { WidgetProps } from '@ui-schema/react/Widget'
import { StoreKeys, extractValue, WithValue } from '@ui-schema/ui-schema/UIStore'
import { PluginStack } from '@ui-schema/ui-schema/PluginStack'

const UnitCalcDummyBase: React.ComponentType<WidgetProps & WithValue> = (
    {
        showValidity, schema, widgets, ...props
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
            schema={schema.getIn(['properties', 'unit']) as UISchemaMap}
            parentSchema={schema}

            // additional props we want to override/add
            showValidity={showValidity}
            readOnly={readOnly}
            binding={widgets}
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

            // additional props we want to override/add
            showValidity={showValidity}
            readOnly={readOnly}
            binding={widgets}
            noGrid

            // is received by the `number` widget
            isKg={value?.get('unit') === 'kg'}
        />
    </>
}

export const UnitCalcDummy: React.ComponentType<WidgetProps> = extractValue(memo(UnitCalcDummyBase))
```

> see the more in-depth docs about the [widget composition concept](/docs/widgets-composition)

## applyWidgetEngine

> ❗ Deprecated.

Function to build autowiring components, which are fully typed with the actual widget properties, useful for full custom UIs or complex widgets.

The created component applies the typescript definitions of the actual widget, but omits those injected by `PluginStack`.

Since `0.4.0-alpha.1`, this function also applies [`memo`](/docs/core-utils#memo--isequal) to the final component.

> todo: currently omits properties (also the `PluginStack`), which are possible because of the used plugins,
> this should be optimized to automatically suggest the props of currently applied `widgets.widgetPlugins` (when possible)

```typescript jsx
import React from 'react'
import Grid from '@mui/material/Grid'
import { createOrderedMap } from '@ui-schema/ui-schema/createMap'
import { WidgetProps } from '@ui-schema/react/Widget'
import { StringRenderer } from '@ui-schema/ds-material/Widgets/TextField'
import { applyWidgetEngine } from '@ui-schema/ui-schema/applyWidgetEngine'

// using `applyWidgetEngine`, this widget is fully typed
// with the actual props of the widget component `StringRenderer`
const WidgetTextField = applyWidgetEngine(StringRenderer)

// custom group component, needed to also validate the root level
// this one works for objects
let CustomGroup: React.ComponentType<WidgetProps> = (props) => {
    const {
        schema, storeKeys,
        // errors for the root/current schema level
        errors, valid,
    } = props

    return <Grid container dir={'columns'} spacing={4}>
        <WidgetTextField
            storeKeys={storeKeys.push('name')}
            schema={schema.getIn(['properties', 'name'])}
            parentSchema={schema}

            // this property comes from `StringRenderer`:
            multiline={false}
        />
    </Grid>
}
// wiring this component, to use for `type: object` schema levels
CustomGroup = applyWidgetEngine(CustomGroup)

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
        /* binding={} showValidity={} t={} */
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

## injectWidgetEngine

> ❗ Deprecated.
>
> ⚠ new since `v0.4.0-alpha.1`

Utility to wire-up wrapper components inside the performance-area of the `PluginStack` and not of the parent component (and additionally inside the `ErrorBoundary` of the `PluginStack`).

Similar to `applyWidgetEngine`, but this function allows to wrap the whole `PluginStack` with another component - and optionally supports the same `CustomWidget` part with a second param.

This function also applies [`memo`](/docs/core-utils#memo--isequal) to the final component.

> this function is typesafe, and works like [`applyWidgetEngine`](#applypluginstack) in that matter

```typescript jsx
import React from 'react'
import { GridContainer } from '@ui-schema/ds-material/GridContainer'
import { applyWidgetEngine } from '@ui-schema/ui-schema/applyWidgetEngine'

// wire up:
const GridStack = injectWidgetEngine(GridContainer)

const Stepper = injectWidgetEngine(GridContainer, WidgetStepper)

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
