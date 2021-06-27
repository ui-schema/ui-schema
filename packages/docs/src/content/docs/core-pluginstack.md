# PluginStack

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

## applyPluginStack

Function to build autowiring components, which are fully typed with the actual widget properties, useful for full custom UIs or complex widgets.

The created component applies the typescript definitions of the actual widget, but omits those injected by `PluginStack`.

> todo: currently omits properties (also the `PluginStack`), which are possible because of the used plugins,
> this should be optimized to automatically suggest the props of currently applied `widgets.pluginStack` (when possible)

```typescript jsx
import React from 'react'
import { List } from 'immutable'
import Grid from '@material-ui/core/Grid'
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

## NextPluginRenderer

Used for plugin rendering, see: [creating plugins](/docs/plugins#create-plugins).

Handles the switching between `WidgetRenderer` and a `Plugin` (if there is still one which was not executed).

### NextPluginRendererMemo

Same as NextPluginRenderer, but as memoized function, used in e.g. object widgets when they are using [useUI](#uistoreprovider), see: [creating plugins](/docs/plugins#create-plugins).

