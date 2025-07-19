---
docModule:
    package: '@ui-schema/json-schema'
    modulePath: "json-schema/src/"
    files:
        - "**/*.ts"
---

# JSON Schema

The `@ui-schema/json-schema` package provides a set of utilities and components for working with JSON Schema, including a validator, type definitions, and plugins for extending JSON Schema capabilities.

> 🚧 **New**, the **API is experimental**, expect breaking changes. Only use like shown in the examples.

```bash
npm i --save @ui-schema/json-schema @ui-schema/json-pointer @ui-schema/ui-schema immutable
```

This package does not depend on react and is designed for server and browser usage. While the implementation is specialized for UI generation related needs, it is a full JSON Schema validator and employs an opinionated JSON Schema traversal and processing.

- [Validator](/docs/json-schema/validator)
