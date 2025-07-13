---
docModule:
    package: '@ui-schema/react'
    modulePath: "react/src/"
    files:
        - "WidgetRenderer/*"
---

# UI Schema Generator & Renderer

Components responsible for the actual rendering of plugins and then finally the widget, using data and functions from the `UI Store` and `UI Meta` providers (or all in one as `UIProvider`)

## WidgetRenderer

Finds the actual widget in the mapping by the then defined schema, renders the widget and passes down all accumulated props (e.g. everything the plugins have added).

If no widget is fund, renders nothing / `null`, but the plugins may have already rendered something! (like the grid)

Executes `onErrors` for that schema level, when `errors` have changed and `onErrors` was specified.

**Is itself in the `widgets` binding** and can be replaced / extended this way, `widgets.WidgetRenderer` (since `0.3.0`).

Uses `matchWidget` to execute the default matching logic: `import {matchWidget} from '@ui-schema/ui-schema/matchWidget';`

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
        // binding={customWidgets}
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
