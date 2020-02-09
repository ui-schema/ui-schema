# Performance

This editor has multiple levels of performance optimization:

- [immutables](https://immutable-js.github.io/immutable-js/) as internal store
    - does not apply to `widgets`, storing memoized components in immutable are a problem 
- [memoization](https://reactjs.org/docs/hooks-reference.html#usememo) of `setData` and `setSchema` action creators
- no html re-rendering of no-changed scopes
    - **previously**: e.g. `setData` updates the hook `useSchemaStore`, thus typing in inputs lags
        - within the core this hook is used to access the context
        - all hook consuming components are re-rendering, you got 100 input fields, all will re-render
    - to **not re-render any HTML** that must not be re-rendered this approach is used:
        - multiple components are like [React.PureComponent](https://reactjs.org/docs/react-api.html#reactpurecomponent) [[memo](https://reactjs.org/docs/hooks-reference.html#usememo)] with logic-html separation
        - the root component accesses the hook, prepares the values, but doesn't render html by itself 
        - this wraps another component that receives props and is a memoized function component 
        - this wraps the actual component (e.g. widget.RootRenderer), and passes it's props down and may decide on what to render based on the props
        - *all rendering widgets are wrapped like that*
    - if you introduce a hook in a widget it is advised that the producing HTML components are also made "dump"
        - pure without using a hook that relies on the onChange of the SchemaEditorStore context
        - e.g. use `useSchemaEditor` only in a parent components and wrap a React.PureComponent (or function equivalent) which may render HTML
    - only the `store` immutable is changing, for each current field it's value is retrieved and pushed to the widget, this way only the widget which's value was changing is re-rendering.
- memoization in the core:
    - widgets:
        - `RootRenderer` is wrapped inside a memoized dump-renderer directly after `SchemaEditor`, will re-render on `schema` and `widgets` change
        - `GroupRenderer` is wrapped inside the memoized renderer `ObjectRenderer`
        - any `types.<Component>`, `custom.<Component>` is wrapped in the memoized `DumpWidgetRenderer`
    - core:
        - `SchemaEditorRenderer` is memoized, receives the widget/widget stack and is the internal entry for starting/nesting the schema
        - `ValueWidgetRenderer`/`ValuelessWidgetRenderer` wraps `DumpWidgetRenderer` which is the abstraction layer to the final widgets
            - `ValueWidgetRenderer` uses the hooks to extract the widgets value (not memoized)
            - `ValuelessWidgetRenderer` doesn't fetch the widgets value, this is used for objects, is memoized, (**currently:** only for objects without a widget)
            - `DumpWidgetRenderer` is not memoized (not needed)
        - `DumpWidgetRenderer` either renders the final widget or starts rendering the `widgetStack`
            - re-renders on changes of **current** widgets properties
            - additionally receives: `Widget`, `widgetStack`
        - `WidgetStackRenderer` initial `widgetStack` render handling (not memoized, but inside `DumpWidgetRenderer`)

It is recommended to build your own ds-binding with only the needed components or use a lazy-loaded binding.

## Docs

- [Overview](../../README.md)
- [UI-JSON-Schema](./Schema.md)
- [Widget System](./Widgets.md)
- [Widget Plugins](./WidgetPlugins.md)
- [Localization / Translation](./Localization.md)
- [Performance](./Performance.md)
