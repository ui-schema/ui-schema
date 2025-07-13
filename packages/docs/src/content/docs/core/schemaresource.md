---
docModule:
    package: '@ui-schema/ui-schema'
    modulePath: "ui-schema/src/"
    files:
        - "SchemaResource/*"
---

# Schema Resource

The schema resource system prepares the UI Schema for rendering by e.g. finding all `$ref` and creating canonical pointers, which can be resolved after the [schema is reduced to its happy path](/docs/widgets-composition#happy-path).
