# UI-Schema Core

The UI Schema core consists of types, shared schema type checks and utils.

```bash
npm i --save @ui-schema/ui-schema @ui-schema/json-pointer immutable
```

This package does not depend on react and is designed for server and browser usage.

Some specialized utilities are included, otherwise it provides an abstraction which requires matching implementations.

- `@ui-schema/json-schema` provides an implementation for the validator system
- `@ui-schema/react` provides
    - an renderer system for the widgets
    - components which rely on the translators and validators types
- `@ui-schema/ui-schema` provides
    - the implementation for the schema plugin stack
    - utility implementation for the translator [JSON schema keywords](/docs/localization#translation-in-schema)
    - the implementation for the schema resource system
    - the implementation for the widget matching
    - various type contracts used by the [plugin systems](/docs/plugins)
