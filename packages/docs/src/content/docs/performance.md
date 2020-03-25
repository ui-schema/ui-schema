# Performance

> some nice flow/flame-graph pictures should be added here

This editor has multiple levels of performance optimization:

- [immutables](https://immutable-js.github.io/immutable-js/) as internal store
    - does not apply to `widgets`, storing memoized components in immutable are a problem 
- [memoization](https://reactjs.org/docs/hooks-reference.html#usememo) of multiple components which work on the context
    - use [memo](/docs/core#memo--isequal), which compares immutable correctly
- no html re-rendering of no-changed scopes
    - **normally**: e.g. `onChange` updates the hook `useSchemaStore`, thus typing in inputs lags
        - within the core this hook is used to access the context
        - all hook consuming components are re-rendering, you got 100 input fields, all will re-render
    - to **not re-render any HTML** that must not be re-rendered this approach is used:
        - multiple components are like [React.PureComponent](https://reactjs.org/docs/react-api.html#reactpurecomponent) [[memo](https://reactjs.org/docs/hooks-reference.html#usememo)] with logic-html separation
        - the root component accesses the hook, prepares the values, but doesn't render html by itself 
        - this wraps another component that receives props and is a memoized function component 
        - this wraps the actual component (e.g. widget.RootRenderer), and passes it's props down and may decide on what to render based on the props
        - only scalar value widgets get the value directly, for others only the pluginStack (these should use `extractValue`)
        - *all rendering widgets are wrapped like that*
    - if you introduce a hook in a widget it is advised that the producing HTML components are also made "dump"
        - pure without using a hook that relies on the onChange of the SchemaEditorStore context
        - e.g. wrap the component with `extractValue`, `extractValidity` and `memo` (all exported by `@ui-schema/ui-schema`)
    - only the `store` immutable is changing, for each current field it's value is retrieved and pushed to the widget, this way only the widget which's value was changing is re-rendering.
- memoization in the core:
    - widgets:
        - `RootRenderer` is wrapped inside a memoized dump-renderer directly after `SchemaEditor`, will re-render on `schema` and `widgets` change
        - `GroupRenderer` is wrapped inside the memoized renderer `ObjectRenderer`
        - any `types.<Component>`, `custom.<Component>` is wrapped in the memoized `DumpWidgetRenderer`
    - core:
        - `SchemaEditorRenderer` is memoized, receives the widget/widget stack and is the internal entry for starting/nesting the schema
        - `WidgetRenderer` wraps `PluginStackRenderer` which is the abstraction layer to the final widgets
        - `PluginStackRenderer` initial `pluginStack` render handling (not memoized, but inside `DumpWidgetRenderer`)
        - `FinalWidgetRenderer` is rendered when the widget-stack is finished, not memoized but extracts the `value` from the props again for non-scalars, thus a object/array component can be memoized and will not re-render when it's items change (memoize widgets your-self when needed) 

Further on to reduce code-size, it is recommended to build your [own ds-binding](/docs/widgets#create-design-system-binding) with only the needed components or use a [lazy-loaded binding](/docs/widgets#lazy-loading-bindings).
