# UI-JSON-Schema

This JSON-Schema vocabulary is used within the included widget-matching:
 
- `type` valid types currently supported: `string`, `number`, `boolean`, `object` ✔
    - `array` validation needs to be implemented, render must be implemented through a widget
- `widget`, non-standard JSON-Schema to select a specific UI ✔

These keywords may be implemented in each widget/design-system:

- `format` e.g. `date` for the `type` `string`
- `title` what should be used as title, default passes it to translation
- `description` what should be used as description, default passes it to translation
- `$comment` is recommended to leave maintaining notes

Universal Keywords:

- `default` what will be used if the field hasn't existing data ✔
    - sets the defined value(s) **before** rendering the UI ✔
- `enum` restricts the value to a list of values, used in e.g. select to build the selection ❗
- `const` to restrict the value to a single value ❌ 

Usage scenario needs to be created:

- [combining schemas](https://json-schema.org/understanding-json-schema/reference/combining.html) ❌
    - `allOf`
    - `anyOf`
    - `oneOf`
    - `not`
- [conditionals](https://json-schema.org/understanding-json-schema/reference/conditionals.html) ❌
    - `allOf`
    - `if`
    - `else`
- [recursive](https://json-schema.org/understanding-json-schema/structuring.html#recursion) with `$ref` ❌
- [schema-id](https://json-schema.org/understanding-json-schema/structuring.html#the-id-property) with `$id` and use `$ref` with `$id` to load partial sub-schemas lazily or include relatively ❌
    
| Supported | Refine | Unsupported |
| :----     | :----  | :----       |
| ✔         | ❗      | ❌          |
    
    
## UI-Schema Extension

The JSON-Schema gets extended with special only-UI keywords:

- `view` currently only used for the grid system
    - `sizeXs`, `sizeSm`, `sizeMd`, `sizeLg`, `sizeXl` to build responsive UIs ✔
- `widget` (see top of page), UI selection ✔
- `t` for [translation](./Localization.md#Translation)

## Types

- [String](#type-string)
- [Number / Float / Int](#type-number)
- [Boolean](#type-boolean)
- [Object](#type-object)
- [Array](#type-array)
- [Null](#type-null)

### Type String

Generic Keywords:

- `required` of parent (array) and in own schema (bool) ❗
- `format` in own schema (widget must implement it)
- [non-JSON](https://json-schema.org/understanding-json-schema/reference/non_json_data.html)
    - `contentMediaType` may be used to change widget behaviour
    - `contentEncoding` may be used to change widget behaviour

Validation Keywords:

- `minLength` string min. length ✔
    - through `MinMaxHandler` from `@ui-schema/ui-schema`
- `maxLength` string max. length ✔
    - through `MinMaxHandler` from `@ui-schema/ui-schema`
- `pattern` ❌

[Specification](https://json-schema.org/understanding-json-schema/reference/string.html)

### Type Number

Numbers can be described as:

- `type` `number` integer or float ✔
- `type` `integer` only integer ❌

Generic Keywords:

- `required` of parent (array) and in own schema (bool) ❌

Validation Keywords:

- `multipleOf` restricts to the multiples of the given number ❌
- `minimum` number min. or same length ❌
- `exclusiveMinimum` number min. length ❌
- `maximum` number max. or same length ❌
- `exclusiveMaximum` number max. length ❌

[Specification](https://json-schema.org/understanding-json-schema/reference/numeric.html)

### Type Boolean

Generic Keywords:

- `required` of parent (array) and in own schema (bool) ❌

[Specification](https://json-schema.org/understanding-json-schema/reference/boolean.html)

### Type Object

Generic Keywords:

- `required` of parent (array) and in own schema (bool) ❌

Validation Keywords:

- `minProperties` min. number of properties ❌
- `maxProperties` max. number of properties ❌
- `additionalProperties` when `false` only defined properties are allowed ❌
- `propertyNames.pattern` regex pattern to limit naming of properties ❌
- `patternProperties` to restrict names of properties to certain types with regex ❌ 
- [dependencies](https://json-schema.org/understanding-json-schema/reference/object.html#dependencies) for dynamic sub-schema/properties ❌

[Specification](https://json-schema.org/understanding-json-schema/reference/object.html)

### Type Array

Validation Keywords:

- `minItems` min. number of items ❌
- `maxItems` max. number of items ❌
- `uniqueItems` all items must be of an unique value ❌
- `items` restricts all items to a specific type (one-all) ❌
- `contains` one or more items needs to be a specific type ❌
- `items` restricts items to a specific type in an order (tuple) ❌
    - `additionalItems` if more then defined for the tuple are allowed ❌

[Specification](https://json-schema.org/understanding-json-schema/reference/array.html)

### Type Null

Can be used to render some only-text/display widget that will not provide any entry in the resulting data.

[Specification](https://json-schema.org/understanding-json-schema/reference/null.html)

## Docs

- [Overview](../../README.md)
- [UI-JSON-Schema](./Schema.md)
- [Widget System](./Widgets.md)
- [Schema-Plugins](./SchemaPlugins.md)
- [Localization / Translation](./Localization.md)
- [Performance](./Performance.md)
