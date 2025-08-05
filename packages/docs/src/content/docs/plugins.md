# Plugins

UI-Schema provides various ways to hook in and customize schema handling and rendering.

- 🔌 **schema plugins**: pure functions which work on each possible value location, receive states, can manipulate all props, can not have side effects
- 🧱 **widget plugins**: render pipeline components, can influence what is rendered and perform reactive side effects, in react it is a React component,
- 🧵 **binding / widget**: render pipeline components,  functions (and the actual widget components)
- 🔍 = validators

Overview of packages and where which part is:

- `@ui-schema/ui-schema`
    - 🐝 contains the engine for [schema plugins 🔌](/docs/core/schemapluginstack)
    - contains the type contracts for validators 🔍, widgets 🧱, and value-location
    - contains no plugin implementations
- `@ui-schema/react`
    - 🐝 contains the engine for [widget plugins 🧱](/docs/react/plugins)
    - 🐝 contains the `binding` 🧵 specification and default implementation for `WidgetRenderer`
    - contains the type contracts for React widgets 🧱
    - 🍯 contains widget plugins 🧱 for the store, agnostic to schema
    - 🍯 contains the widget plugin 🧱 to run the `@ui-schema/ui-schema` schema plugins 🔌
    - 🍯 contains widget plugins 🧱 (the legacy plugins from `<=0.4.x`)
    - 🍯 contains `binding 🧵` components and widget implementations 🧱, all headless (those with HTML output are only in design-systems, or deprecated)
- `@ui-schema/json-schema`
    - 🐝 contains a [validator system 🔍](/docs/json-schema/validator), with pluggable validators, specific to JSON Schema, opinionated for UI Schema
    - 🍯 contains the schema plugin 🔌 to run the validator 🔍, and additional useful [schema plugins 🔌](/docs/json-schema/plugins)
    - 🍯 contains [validators 🔍](/docs/json-schema/validators) for JSON Schema

---

- 🐝 = engine, runtime
- 🍯 = implementations
