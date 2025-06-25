# Concepts & Widgets Composition

This page contains more in-depth docs and thoughts about the [widgets](/docs/widgets) composition and core concepts - which enable near endless widget & plugins customization, powered by `@ui-schema/ui-schema`.

## Deep Dive Concepts

"Basic concepts" to get a better understanding of what's going on in the core:

Built with the ReactJS native [render flow](https://reactjs.org/docs/state-and-lifecycle.html#the-data-flows-down) and [hoisted states](https://reactjs.org/docs/lifting-state-up.html#lifting-state-up) as foundation, leaning a few principles from [`redux`](https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow) / [`flux`](https://facebook.github.io/flux/docs/in-depth-overview).

Rendering [atomic conditional](https://reactjs.org/docs/conditional-rendering.html) and [pure](https://medium.com/technofunnel/working-with-react-pure-components-166ded26ae48) wrapper components around single schema levels. Forming a [typical AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) by the [happy path according to schema & data](#happy-path).

A lot of [component composition](https://www.robinwieruch.de/react-component-composition) by the `PluginStack`, around `WidgetOverride` or/and the [`widgets` binding](/docs/widgets#create-design-system-binding) to get / specify the needed custom react components for each usage, thus there is [no HTML-output inside the core](#output-in-core).

Custom [`React.Context` / Providers](https://reactjs.org/docs/context.html) are used for handling store updates and extracting with special [HOCs](https://reactjs.org/docs/higher-order-components.html) (connecting `store` to `props`), but enabling `store`/`state` management by typical stuff like `React.useState`, `React.useReducer` or redux reducers.

Using an additional [plugins system based on props](/docs/core-pluginstack#simple-plugins) for a shallower component tree of e.g. validators.

## Widgets & Component Plugins

Each plugin or widget should only need to do one specific thing, in one specific schema layer, leading to [enhanced performance](https://reactjs.org/docs/optimizing-performance.html#shouldcomponentupdate-in-action) and optimizing [reconciliation levels](https://reactjs.org/docs/reconciliation.html). The values are stored in a central [immutable data-structure](/docs/core-store), accessible per schema-level by the schema-position with `storeKeys` (a list of the keys (`string|number`)), the `storeKeys` need to be passed down in nested components (e.g. `object`).

> check also the base concepts about [performance](/docs/performance), especially keep an eye open for `non-scalar` widget infos and `memo`

The AST and plugins are rendered by [`PluginStack`](/docs/core-pluginstack) - initially started by [`UIRootRenderer`](/docs/core-renderer#uirootrenderer).

A plugin or widget can use more than only it's own schema/store level in various ways.

- `ObjectRenderer` uses one schema-level, to build the next level automatically, by nesting of `PluginStack`
- if the next level can only be rendered when the `value` is known, a non-scalar widget (`array`/`object`) must use `extractValue` to extract exactly it's own store values (`value`, `internalValue`), e.g. building a table out of array tuple items schemas
- the `UIApi`/`ReferencingNetworkHandler` components use [React hooks](https://reactjs.org/docs/hooks-intro.html) to connect to `UIApiProvider` from within the plugin component.

## Rendering Basics

Special entry point components start the UI Rendering, connecting to and/or creating some contexts & providers and/or relying on given props to do something, according to their definite position in `schema` and data (`storeKeys`).

See [flowchart of @ui-schema/ui-schema](/docs/core#flowchart), textual example: `UIMetaProvider` > `UIStoreProvider` > `UIRootRenderer` > `widgets.RootRenderer` > `PluginStack` > optional `ErrorBoundary` with `widgets.ErrorFallback` > `widgets.widgetPlugins` including `widgets.simplePuginStack` > `WidgetRenderer` > widget matching > actual `Widget`.

### Happy Path

From within the rendering engine, the `schema` is used to automatically create the UI to "enter data for a specific schema-level".

To be able to do this, the render engine must reduce the `schema` and data to specific behaviour & rendering instructions.

For some JSON-Schema keywords / keyword combinations it can not exactly know what it should do & what to render. This could be due to [illogical schemas](https://json-schema.org/understanding-json-schema/reference/combining.html#illogical-schemas) or uncertain parts [like subschema independence](https://json-schema.org/understanding-json-schema/reference/combining.html#subschema-independence) - or just because there would be too many options to automatically solve (like with `array`, multiple scalar types).

#### Example for subschema independence

- multiple `anyOf` should evaluate either one or another schema
- but what UI should be rendered?
- this can only be assumed by existing data
    - but not always, not fully reliable
- a custom `widget` that supports "user can select which one", can handle those schemas correctly
    - *todo:* there isn't a `anyOf` validator atm.

#### Example for multiple types

- the widget matching must resolve to a specific `native-type` (or be overwritten with a custom `widget`)
- validation can support multiple types, e.g. as it only must validate `type: string` when the value is of type `string`
- for `"type": "string"` exactly one widget can match
- for `"type": "null"` exactly one widget can match
- for `"type": ["string", "null"]` multiple widgets may match
    - but for this special use case, it does infer to render `string`, as `null` doesn't have an input use case
- for `"type": ["string", "number", "null"]` multiple widgets may match
    - and it could not determine what to render exactly, when no data exists
    - this must be handled with a custom `"widget": "StringOrNumber"` which e.g. allows selecting if a `string` or `number` can be entered

Together with cases like: `deleteOnEmpty` within `array` [issue #106](https://github.com/ui-schema/ui-schema/issues/106), the happy-path also influences what data store updates really do.

### Output in Core

These are the only positions where `@ui-schema/ui-schema` renders output directly.

- error info in `matchWidget` (and thus also `WidgetRenderer`) renders an empty fragment with `missing-*` text when no widget is matching
    - can be changed with a custom `WidgetRenderer` and the prop-component `NoWidget`, bind the custom renderer to `widgets.WidgetRenderer`
- loading info in `Plugins/ReferencingHandler`while missing schemas are loaded AND it is not virtual
    - the `Translate` component is rendered with `labels.loading` and with fallback text `Loading`
