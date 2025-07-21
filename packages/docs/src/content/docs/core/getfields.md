---
docModule:
    package: '@ui-schema/ui-schema'
    modulePath: "ui-schema/src/"
    files:
        - "getFields/*"
---

# Schema Fields Normalization

The `getFields` utility is designed to simplify the process of accessing and normalizing schema definitions, particularly for complex JSON Schemas that involve keywords like `items`, `prefixItems`, `properties`, `$ref`, and `allOf`. It helps in consistently retrieving the structure of sub-schemas, which is crucial for rendering UI components based on these definitions.

### Why `getFields`?

JSON Schema is powerful but can be complex, especially when dealing with array and object schemas that use various keywords for defining their children. For instance:

- **Arrays:** Can define their items using `items` (for homogeneous arrays or tuples) and `prefixItems` (for modern tuple definitions). `additionalItems` further specifies behavior for items beyond the defined `prefixItems`.
- **Objects:** Define their properties using `properties`, `patternProperties`, and `additionalProperties`.

Furthermore, schemas can reference other schemas using `$ref` or combine multiple schemas using `allOf`. When building a UI, you often need to understand the *effective* schema for a given field, after all these resolutions and combinations have taken place. `getFields` aims to provide this normalized view.

### How `getFields` Works

The `getFields` function takes a `schema` (an Immutable.js Map representing a JSON Schema) and an optional `options` object (which can include a `resource` for resolving `$ref`s). It then processes the schema to extract and normalize information about its potential child schemas.

It performs the following key operations:

#### Normalization and Hoisting of Keywords

`getFields` first normalizes the different ways array and object schemas can define their children:

- **`items` and `prefixItems`:** It harmonizes the handling of `items` (for homogeneous arrays or older tuple definitions) and `prefixItems` (for modern tuple definitions, Draft 2019-09+). It also correctly interprets `additionalItems` in this context.
- **`properties`, `patternProperties`, `additionalProperties`:** It extracts these keywords for object schemas, ensuring a consistent understanding of how properties are defined.

#### `$ref` Resolution

If a schema contains a `$ref` keyword, `getFields` (via its internal `resolveSchema` function) attempts to resolve this reference using the provided `resource.findRef` function. This means that if your schema refers to another schema defined elsewhere (e.g., in a separate file or a definitions section), `getFields` will fetch and integrate that referenced schema into the current one. This is crucial for understanding the complete structure of a schema that spans multiple definitions.

#### `allOf` Combination

The `allOf` keyword in JSON Schema allows combining multiple sub-schemas. `getFields` handles `allOf` by merging the schemas defined within it. This merging process (handled by the `combineSchema` function) is intelligent:

- It prioritizes certain keywords (like `type`, `title`, `description`, `view`, `t`) by "hoisting" them to the main schema.
- For `type`, it performs an intersection of types, ensuring that the resulting schema only allows types common to all `allOf` sub-schemas.
- For `properties` and `items`, it attempts to hoist non-conflicting properties/items. If conflicts arise (e.g., a property is defined differently in multiple `allOf` schemas), the conflicting parts are added back to an `allOf` array within the merged schema, ensuring no information is lost.

This combination logic ensures that the resulting schema accurately reflects the combined rules of all `allOf` sub-schemas.

#### What are static children?

In the context of `getFields`, "static children" refer to the sub-schemas that can be determined directly from the parent schema's definition, without needing to inspect the actual data (`value`) or apply complex conditional logic (like `if`/`then`/`else` or `oneOf`/`anyOf`).

These are the children whose structure is explicitly defined by keywords like:

- **`properties`**: For object schemas, these are the named properties with their corresponding sub-schemas.
- **`items`**: For array schemas, this can refer to:
    - A single schema that applies to all items in a homogeneous array.
    - A list of schemas for a tuple-style array (where each item at a specific index has a defined schema).
- **`prefixItems`**: A modern alternative to `items` for defining tuple-style arrays, where each item at a specific index has a defined schema.
- **`additionalProperties`**: For object schemas, this defines the schema for any properties not explicitly listed in `properties` or `patternProperties`. If it's a boolean `false`, it means no additional properties are allowed. If it's a schema, it applies to all additional properties.
- **`additionalItems`**: For array schemas using `prefixItems` or tuple-style `items`, this defines the schema for any items beyond the explicitly defined ones. If `false`, no additional items are allowed.

`getFields` focuses on these "static" definitions because they can be resolved and combined upfront, providing a clear picture of the schema's structure for UI rendering purposes, even before any data is available. This is in contrast to "dynamic" children, which might depend on the value of other fields or complex validation rules, and thus require the validation-backed approach provided by [@ui-schema/json-schema](/docs//json-schema).

By providing `getStaticSchema` and `getStaticChildren` methods, `getFields` allows developers to easily access these pre-resolved and normalized static sub-schemas, simplifying the process of building UI components that adapt to various JSON Schema structures.

#### What it does not do / Where value is needed

`getFields` is designed to provide a static, pre-resolved view of the schema structure. This means it focuses on keywords that define the schema's shape regardless of the actual data (`value`) or complex conditional logic.

Therefore, `getFields` **does not** handle or resolve keywords that require the actual data (`value`) to determine the schema's structure or validity. These include:

- **`if`/`then`/`else`/`oneOf`/`anyOf`/`not`**: These keywords define schemas that depend on the evaluation of against the instance data. `getFields` cannot predict which branch (e.g. `then` or `else`) will be active without knowing the `value`.
- **`patternProperties` (for dynamic property names)**: While `getFields` extracts `patternProperties`, it does not apply the patterns to actual property names from a `value` to determine which dynamic properties might exist.
- **`propertyNames`**: This keyword defines a schema that all property names in an object must validate against. `getFields` extracts this schema, but it does not validate actual property names from a `value`.

These dynamic aspects are typically handled by:

- **Validation processes**: Dedicated JSON Schema validators (like those in `@ui-schema/json-schema/Validators`) are responsible for checking the `value` against all schema constraints, including conditional and logical keywords.
- **Runtime UI logic**: For dynamic UI elements (e.g., adding new items to an array based on user input, or rendering different fields based on a dropdown selection), the UI component itself needs to react to the `value` and potentially use the `validate` and `getOptionsFromSchema` functions to determine the available options for a field.

## Examples

### Example 1: Basic Object Schema

This example demonstrates how `getFields` extracts properties from a simple object schema.

```jsx
import { fromJSOrdered } from '@ui-schema/ui-schema/createMap'
import { getFields } from '@ui-schema/ui-schema/getFields'

const schema = fromJSOrdered({
    type: 'object',
    properties: {
        firstName: { type: 'string', title: 'First Name' },
        lastName: { type: 'string', title: 'Last Name' },
    },
})

const fields = getFields(schema)
const staticChildren = fields.getStaticChildren('properties')

console.log(staticChildren.kind) // 'properties'
console.log(staticChildren.children.toJS())
/*
{
    firstName: { type: 'string', title: 'First Name' },
    lastName: { type: 'string', title: 'Last Name' }
}
*/
```

### Example 2: Array Schema with Homogeneous Items

Here, `getFields` processes an array schema where all items conform to a single schema.

```jsx
import { fromJSOrdered } from '@ui-schema/ui-schema/createMap'
import { getFields } from '@ui-schema/ui-schema/getFields'

const schema = fromJSOrdered({
    type: 'array',
    items: { type: 'string', title: 'Item' },
})

const fields = getFields(schema)
const staticChildren = fields.getStaticChildren('items')

console.log(staticChildren.kind) // 'items'
console.log(staticChildren.schema.toJS())
/*
{ type: 'string', title: 'Item' }
*/
console.log(staticChildren.additional) // true (default for homogeneous arrays)
```

### Example 3: Array Schema with `prefixItems` and `items` (Tuple-like)

This example shows how `getFields` handles `prefixItems` (for fixed-position items) and `items` (for additional items) in an array schema.

```jsx
import { fromJSOrdered } from '@ui-schema/ui-schema/createMap'
import { getFields } from '@ui-schema/ui-schema/getFields'

const schema = fromJSOrdered({
    type: 'array',
    prefixItems: [
        { type: 'string', title: 'First Item' },
        { type: 'number', title: 'Second Item' },
    ],
    items: { type: 'boolean', title: 'Additional Item' }, // schema for additional items
})

const fields = getFields(schema)
const staticChildren = fields.getStaticChildren('items')

console.log(staticChildren.kind) // 'items'
console.log(staticChildren.children.toJS())
/*
{
    0: { type: 'string', title: 'First Item' },
    1: { type: 'number', title: 'Second Item' }
}
*/
console.log(staticChildren.additional) // true
console.log(staticChildren.schema.toJS())
/*
{ type: 'boolean', title: 'Additional Item' }
*/
```

### Example 4: Object Schema with `$ref` Resolution

This demonstrates how `getFields` resolves a `$ref` to another schema definition.

```jsx
import { fromJSOrdered } from '@ui-schema/ui-schema/createMap'
import { getFields } from '@ui-schema/ui-schema/getFields'
import { resourceFromSchema } from '@ui-schema/ui-schema/SchemaResource'

const schema = fromJSOrdered({
    type: 'object',
    $defs:{
        address: {
            type: 'object',
            properties: {
                street: { type: 'string' },
                city: { type: 'string' },
            },
        },
    },
    properties: {
        billingAddress: { $ref: '#/$defs/address' },
        shippingAddress: { $ref: '#/$defs/address' },
    },
})

// prepare a resource, for linking $refs
const resource = resourceFromSchema(schema)

const fields = getFields(resource.branch.value(), { resource })
const staticChildren = fields.getStaticChildren('properties')

console.log(staticChildren.kind) // 'properties'
console.log(staticChildren.children.toJS())
/*
{
    billingAddress: {
        type: 'object',
        properties: {
            street: { type: 'string' },
            city: { type: 'string' }
        }
    },
    shippingAddress: {
        type: 'object',
        properties: {
            street: { type: 'string' },
            city: { type: 'string' }
        }
    }
}
*/
```
