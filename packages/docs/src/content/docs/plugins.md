# Plugins

UI-Schema provides various ways to hook in and customize schema handling and rendering.

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
- `@ui-schema/json-schema`
    - 🐝 contains a [validator system 🔍](/docs/json-schema/validator), with pluggable validators, specific to JSON Schema, opinionated for UI Schema
    - 🍯 contains the schema plugin 🔌 to run the validator 🔍, and additional useful [schema plugins 🔌](/docs/json-schema/plugins)
    - 🍯 contains [validators 🔍](/docs/json-schema/validators) for JSON Schema
- `@ui-schema/react-json-schema`
    - 🍯 contains widget plugins 🧱 (the legacy plugins from `<=0.4.x`)
    - 🍯 contains `binding 🧵` components and widget implementations 🧱, all headless (those with HTML output are only in design-systems)

---

- 🐝 = engine, runtime
- 🍯 = implementations
- 🔌 = schema plugins
- 🧱 = widget plugins
- 🧵 = binding / widget
- 🔍 = validators
