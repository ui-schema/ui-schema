# UI Schema Generator & Renderer

Components responsible for the actual rendering of plugins and then finally the widget, using data and functions from the `UI Store` and `UI Meta` providers (or all in one as `UIProvider`)

> ❗ These components will have a breaking change in `v0.5.0`, split up into own modules, [see issue](https://github.com/ui-schema/ui-schema/issues/100)

## UIGenerator

> ⚠ deprecated, will be removed in `v0.5.0`

Convenience, single-entry-point UI Schema generator, starts the whole schema and renders the RootRenderer with `UIRootRenderer`, **checkout the [quick-start](/quick-start)** for a full example!

## UIRootRenderer

> ⚠ deprecated, will be removed in `v0.5.0`

Connects to the current context and starts parsing the schema, renders the `widgets.RootRenderer`.

Starts rendering the root level schema with [`PluginStack`](/docs/core-pluginstack), (passed to `widgets.RootRenderer` in `children` prop).

`widgets.RootRenderer` is rendered inside it, within a memoized component.

```javascript
import {UIStoreProvider} from '@ui-schema/ui-schema/UIStore';
import {UIRootRenderer} from '@ui-schema/ui-schema/UIRootRenderer';

<UIStoreProvider
    store={store}
    onChange={onChange}
    showValidity={showValidity}
>
    <UIRootRenderer schema={schema}/>
</UIStoreProvider>
```

## WidgetRenderer

Finds the actual widget in the mapping by the then defined schema, renders the widget and passes down all accumulated props (e.g. everything the plugins have added).

If no widget is fund, renders nothing / `null`, but the plugins may have already rendered something! (like the grid)

Executes `onErrors` for that schema level, when `errors` have changed and `onErrors` was specified.

**Handles removing props**, before rendering the actual widget component. For performance reasons removes these `props`:

- `value` is removed for `schema.type` `array` or `object`
- `internalValue` is removed for `schema.type` `array` or `object`
- `requiredList` is removed for every type

**Is itself in the `widgets` binding** and can be replaced / extended this way, `widgets.WidgetRenderer` (since `0.3.0`).

Uses `widgetMatcher` to execute the default matching logic: `import {widgetMatcher} from '@ui-schema/ui-schema/widgetMatcher';`

## ObjectGroup

Component - not a widget - for custom UI generation and handling `type=object` schema levels - without needing to nest everything.

Use the property `onSchema` to get the maybe-changed schema up to the parent component, then reuse that for your other widgets.

To get the errors of that schema level, use `onErrors` from [`WidgetRenderer`](#widgetrenderer).

```typescript jsx
const freeFormSchema = OrderedMap()

const WidgetTextField = applyWidgetEngine(StringRenderer)

const FreeFormEditor = () => {
    const [store, setStore] = React.useState(() => createStore(OrderedMap()))
    const [schema, setSchema] = React.useState<UISchemaMap>(() => freeFormSchema)

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
                    storeKeys={storeKeys.push('name') as StoreKeys}
                    schema={schema.getIn(['properties', 'name']) as unknown as UISchemaMap}
                    parentSchema={schema}

                    // using `applyWidgetEngine`, this free-form widget is fully typed
                    // with the actual props of the widget component
                    multiline={false}
                />
            </Grid>
        </ObjectGroup>

    </UIProvider>
}
```

## ObjectRenderer

Widget used automatically for `type=object` that do not have a custom `widget`, used by `WidgetRenderer`.
