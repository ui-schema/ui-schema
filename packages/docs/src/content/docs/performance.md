# Performance

> some nice flow/flame-graph pictures should be added here

This ui renderer has multiple levels of performance optimization:

- [immutables](https://immutable-js.github.io/immutable-js/) as internal store
    - does not apply to `widgets`, storing memoized components in immutable are a problem
- [memoization](https://reactjs.org/docs/hooks-reference.html#usememo) of multiple components which work on the context
    - use [memo](/docs/core-utils#memo--isequal), which compares immutable correctly (in `@ui-schema/ui-schema`, not the one in `react`)
- no html re-rendering of unchanged scopes
    - **normally**: e.g. `onChange` updates the hook `useUI`, thus typing in inputs lags
        - within the core this hook is used to access the context
        - all hook consuming components are re-rendering, you got 100 input fields, all will re-render
    - to **not re-render any HTML** that must not be re-rendered, this approach is used:
        - [lifted up](https://reactjs.org/docs/lifting-state-up.html) `UIMetaProvider`, that does not re-render when `UIStoreProvider` re-renders
        - implementation follows [React.PureComponents](https://reactjs.org/docs/react-api.html#reactpurecomponent) using [memo](https://reactjs.org/docs/hooks-reference.html#usememo), compatible with full logic-html separation
        - the root component accesses the hook, prepares the values, but doesn't render html by itself
        - this wraps another component which receives props and is a memoized function component
        - this wraps the actual component (e.g. `widget.RootRenderer`), and passes its props down and may decide on what to render based on the props
        - only scalar value widgets get the value directly, for others only the pluginStack (these should use `extractValue`)
        - *all rendering widgets are wrapped like that*
    - if you introduce a hook in a widget it is advised that the producing HTML components are also made "dump"
        - pure without using a hook that relies on the onChange of the SchemaUIStore context
        - e.g. wrap the component with `extractValue`, `extractValidity` and `memo` (all exported by `@ui-schema/ui-schema`)
        - `useUIMeta` can be used safely without introducing re-rendering
        - this way only the widget whose `value` was changing is re-rendering.
- memoization in the core:
    - widgets:
        - `RootRenderer` is wrapped inside a memoized dump-renderer directly after `UIRootRenderer`, will re-render on `schema` and `widgets` change
        - `GroupRenderer` is wrapped inside the memoized renderer `ObjectRenderer`
        - any `types.<Component>`, `custom.<Component>` run as the last step in `PluginStack`, the plugin stack in itself uses memoization where needed
        - list / generic widgets (non-scalar values) use further nesting, skipping e.g. table headers for any store changes, table footer only receives the number of elements, not the list itself
    - only the `store` immutable is changing, for each current field it's value is retrieved by the HOCs (e.g. `extractValue`) and pushed to the widget
    - core:
        - `PluginStack` not memoized, optimization in the wrapping level is mostly better
            - since `0.3.0` the re-render is triggered within the `widgets.pluginStack` by e.g. `ExtractStorePlugin`
            - receives the widget/widget stack and is the internal entry for starting/nesting the schema with rendering the first `Plugin`
        - `ExtractStorePlugin` is memoized and injects the schema-level `value`/`internalValue`/`onChange` into the `props` for the next plugins in the stack
            - this component will re-render anytime something in the `store` changes
            - but enforces that any further plugin is only executed again when something in the schema-level values has changed
        - `WidgetRenderer` is rendered when the plugin-stack is finished, not memoized but removes `value`/`internalValue` from the props again for non-scalar widgets
            - an `object`/`array` component can be memoized and will not re-render when it's item change (memoize "non-scalar value widgets" on your own!)
            - use the HOC `extractValue` at your required component, e.g. skip some of the wrapped HTML for re-rendering

Further on to reduce code-size, it is recommended to build your [own ds-binding](/docs/widgets#create-design-system-binding) with only the needed components or use a [lazy-loaded binding](/docs/widgets#lazy-loading-bindings).
