---
docModule:
    package: '@ui-schema/ui-schema'
    modulePath: "ui-schema/src/"
    files:
        - "SchemaResource/*"
---

# Schema Resource

The schema resource system prepares the JSON schema for rendering, e.g. by finding all `$ref` and creating canonical pointers which can be resolved after the [schema is reduced to its happy path](/docs/widgets-composition#happy-path).

See the [react schema resource provider on how to use it](/docs/react/schemaresourceprovider).
