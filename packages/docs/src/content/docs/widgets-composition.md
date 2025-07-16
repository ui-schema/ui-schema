# Concepts & Widgets Composition

This page contains more in-depth docs and thoughts about the [widgets](/docs/widgets) composition and core concepts - which enable near endless widget & plugins customization, powered by `@ui-schema/ui-schema`.

## Deep Dive Concepts

"Basic concepts" to get a better understanding of what's going on in the core:

Built with the ReactJS native [render flow](https://reactjs.org/docs/state-and-lifecycle.html#the-data-flows-down) and [hoisted states](https://reactjs.org/docs/lifting-state-up.html#lifting-state-up) as foundation, leaning a few principles from [`redux`](https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow) / [`flux`](https://facebook.github.io/flux/docs/in-depth-overview).

Rendering [atomic conditional](https://reactjs.org/docs/conditional-rendering.html) and [pure](https://medium.com/technofunnel/working-with-react-pure-components-166ded26ae48) wrapper components around single schema levels. Forming a [typical AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) by the [happy path according to schema & data](#happy-path).

A lot of [component composition](https://www.robinwieruch.de/react-component-composition) by the `WidgetEngine`, around `WidgetOverride` or/and the [`binding`, especially `.widgets`](/docs/widgets#create-design-system-binding) to get / specify the needed custom react components for each usage, thus there is [no HTML-output inside the core](#output-in-core).

Custom [`React.Context` / Providers](https://reactjs.org/docs/context.html) are used for handling store updates and extracting with special [HOCs](https://reactjs.org/docs/higher-order-components.html) (connecting `store` to `props`), but enabling `store`/`state` management by typical stuff like `React.useState`, `React.useReducer` or redux reducers.

Using an additional [plugins system based on props](/docs/react/widgetengine#simple-plugins) for a shallower component tree of e.g. validators.

## Widgets & Component Plugins

Each plugin or widget should only need to do one specific thing, in one specific schema layer, leading to [enhanced performance](https://reactjs.org/docs/optimizing-performance.html#shouldcomponentupdate-in-action) and optimizing [reconciliation levels](https://reactjs.org/docs/reconciliation.html). The values are stored in a central [immutable data-structure](/docs/react/store), accessible per schema-level by the schema-position with `storeKeys` (a list of the keys (`string|number`)), the `storeKeys` need to be passed down in nested components (e.g. `object`).

> Check the base concepts about [performance](/docs/performance) to learn how unnecessary re-renders are reduced.

The AST and plugins are rendered by [`WidgetEngine`](/docs/react/widgetengine).

A plugin or widget can use more than only it's own schema/store level in various ways.

- `ObjectRenderer` uses one schema-level, to build the next level automatically, by nesting of `WidgetEngine`
- *(deprecated in 0.5.x)* the `UIApi`/`ReferencingNetworkHandler` components use [React hooks](https://reactjs.org/docs/hooks-intro.html) to connect to `UIApiProvider` from within the plugin component.

## Rendering Basics

Special entry point components start the UI Rendering, connecting to and/or creating some contexts & providers and/or relying on given props to do something, according to their definite position in `schema` and data (`storeKeys`).

See [flowchart of @ui-schema/ui-schema](/docs/core#flowchart), textual example: `UIMetaProvider` > `UIStoreProvider` > `WidgetEngine` > (optional `binding.ErrorFallback` >) `binding.widgetPlugins` (including `SchemaPluginsAdapter` with validator plugin) > `binding.WidgetRenderer` > widget matching > actual `Widget`.

### Happy Path

In `@ui-schema`, the **validator and render engine** transforms a JSON Schema into an interactive UI. This is done automatically — by interpreting schema definitions into input components and rendering logic. This process works best when schemas are written to follow a predictable, declarative structure — this is what we call the **"happy path."**

> A happy path schema makes it easy for the renderer to answer:
>
> **"What inputs should exist, and how should the user interact with them?"**

#### From Schema to UI: Rendering vs. Validation

While traditional JSON Schema **validators** only need to evaluate a schema *against existing data*, a UI renderer like `@ui-schema` must go further.

It needs to explore:

- What fields **could** exist at the current state?
- Where does each field reside within the overall object tree?
- Which subschemas are **eligible to render** now, based on schema logic and current data?
- What overlapping definitions (e.g., shared properties across multiple `allOf` branches) must be **merged or deduplicated**?

To support this, `@ui-schema` uses two complementary strategies:

##### Depth-First Traversal

The engine recursively walks the schema tree:

- From the root object down through nested objects, arrays, combination and conditional sub-schemas
- Using validation results, when available, to decide which branches to follow
- Treating the schema as an **abstract syntax tree (AST)** — a stable and declarative source of truth, whether or not data exists
- Ensuring that rendering remains **predictable** even in the absence of data
- Binding UI state (e.g., validation, defaults, errors) along the way

This traversal ensures:

- Deeply nested fields are rendered consistently and in the correct hierarchy
- UI state is scoped to the correct data paths
- Custom widgets and logic can attach precisely to their intended positions in the schema

##### Look-Ahead Evaluation

Unlike validators, the renderer must also consider what **could** exist — not just what’s currently present in the data.

- For schema constructs like `if/then/else`, `oneOf`, or `anyOf`, it may **preload or prepare** UI for multiple potential branches
- For nested objects and optional fields, it must **suggest or show** properties that are not yet in the data
- This **forward-looking behavior** is essential for interactive UIs that guide users through available inputs

In short: validators can afford to be reactive — but UI renderers must be **proactive**. They need to make decisions about *possibilities*, not just *presence*, all while keeping behavior **predictable and schema-driven**.

#### Why Not Everything Can Be Automatic

Despite `@ui-schema`'s advanced inference, some JSON Schemas are either too ambiguous or too complex to render automatically.

This includes cases like:

- ❌ [Illogical schemas](https://json-schema.org/understanding-json-schema/reference/combining.html#illogicalschemas) — where combining keywords contradict each other (e.g. `type: "string"` and `properties`)
- ❓ [Subschema independence](https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-00#rfc.section.11.1) — where subschemas in `allOf`, `anyOf`, `oneOf` don't compose meaningfully
- 🌀 Overly dynamic schemas — e.g., `array` schemas allowing multiple types or deeply nested combinations

In these cases, you may need to:

- Write **custom widgets**
- Use **custom plugins** for rendering logic
- Use **custom validators** to produce `applied` schema
- Or re-structure the schema to provide a predictable "happy path"

#### Best Practices for the Happy Path

To stay on the happy path:

- Structure schemas **declaratively** (one `type`, predictable `properties`)
- Avoid deeply nested `oneOf` unless you can clearly control selection
- Use `widget` and plugin-based enhancements to guide the renderer
- Think in terms of **Schema as Behavior Blueprint**
- Think of JSON Schema not just as a validator — but as a blueprint for UI behavior and layout.
- The schema defines what can exist, and the UI must infer how it could appear — regardless of current data state.
- This blueprint must be possible to reduce to concrete rendering decisions at each schema level: what widgets to show, what fields to expand, and what interactions to offer.

##### Summary

| Engine Role      | JSON Schema Validator      | `@ui-schema` UI Renderer               |
|------------------|----------------------------|----------------------------------------|
| Purpose          | Validate existing data     | Render what could be input             |
| Strategy         | Reactive                   | Proactive (look-ahead)                 |
| Missing fields   | Ignored unless required    | May be shown for interaction           |
| Schema traversal | Shallow or conditional     | Depth-first, full expansion            |
| Branch logic     | Evaluated on data presence | Pre-rendered or conditionally rendered |

By understanding the happy path and the **depth-first / look-ahead** nature of UI schema rendering, you’ll be able to craft schemas that are not just valid — but also powerful, dynamic, and highly usable.

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
    - since `0.5.x` the matcher removes `null`, orders multiple types and joins them with a `+`, to make it easier to define suitable widgets
        - `"type": ["string", "number", "null"]` becomes `number+string`
        - `"type": ["string", "boolean", "number"]` becomes `boolean+number+string`
        - check the [test file of `schemaTypeToDistinct`](https://github.com/ui-schema/ui-schema/blob/6b013875f655e845ffe82d86fbb51eafd7d5770f/packages/ui-schema/src/schemaTypeToDistinct/schemaTypeToDistinct.test.ts) for more examples

Together with cases like: `deleteOnEmpty` within `array` [issue #106](https://github.com/ui-schema/ui-schema/issues/106), the happy-path also influences what data store updates really do.

### Output in Core

With v0.5.x the `@ui-schema/ui-schema` package is isomorphic and not responsible to produce anything itself.

The new "rendering core" `@ui-schema/react` has no hard coded output, only headless components and hooks are required to get it working.

Output only exists in two **optional components**:

- `@ui-schema/react`
    - if no widget could be matched, the `NoWidget` is rendered by `WidgetRenderer`
        - caused by error which is emitted by `matchWidget`
        - can be changed with a custom `NoWidget` component in the `binding`
        - renders an empty fragment with `missing-*` text when no widget is matching
    - *(deprecated in 0.5.x)* loading info in `Plugins/ReferencingHandler` while missing schemas are loaded AND it is not virtual
        - the `Translate` component is rendered with `labels.loading` and with fallback text `Loading`
