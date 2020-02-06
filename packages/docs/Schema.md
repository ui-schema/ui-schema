# UI-JSON-Schema

This JSON-Schema vocabulary is used within the included widget-matching:
 
- `type` valid types: `string`, `number`, `boolean`, `object`, `array` ✔
    - `array` render must be implemented through a widget
    - validity for `typeof undefined` must be handled depending on `required` in the widget
    - multi-type support for one schema ❌
- `widget`, non-standard JSON-Schema to select a specific UI ✔

These keywords may be implemented in each widget/design-system:

- `format` e.g. `date` for the `type` `string`
- `title` what should be used as title, passed to translation
- `description` what should be used as description, passed to translation
- `$comment` is recommended to leave maintaining notes

Universal Keywords:

- `default` what will be used if the field hasn't existing data ✔
    - sets the defined value(s) **before** rendering the UI ✔
- `enum` restricts the value to a list of values, used in e.g. select to build the selection ✔
    - [specification](https://json-schema.org/understanding-json-schema/reference/generic.html#enumerated-values)
- `const` to restrict the value to a single value ✔
    - when `object` or `array` only works correctly with immutable `List` or `Map`, the initially provided schema and data props are already compatible
    - [specification](https://json-schema.org/understanding-json-schema/reference/generic.html#constant-values)

Usage scenario needs to be created:

- structuring, reuse, extension
    - [recursive](https://json-schema.org/understanding-json-schema/structuring.html#recursion) with `$ref` ❌
    - [schema-id](https://json-schema.org/understanding-json-schema/structuring.html#the-id-property) with `$id` and use `$ref` with `$id` to load partial sub-schemas lazily or include relatively ❌
    
| Supported | Refine | Unsupported |
| :----     | :----  | :----       |
| ✔         | ❗      | ❌          |
    
>
> target support is JSON-Schema [Draft 2019-09](https://json-schema.org/draft/2019-09/release-notes.html) with minor differences (UX / Native Form Feeling)
>
> extended with non-standard vocabulary for UI purposes
>
    
## UI-Schema Extension

The JSON-Schema gets extended with special only-UI keywords:

- `view` currently only used for the grid system ✔
- `widget` (see top of page), UI selection ✔
- `t`, `tt` for [translation](./Localization.md#Translation)

### View Keyword

- `sizeXs`, `sizeSm`, `sizeMd`, `sizeLg`, `sizeXl` to build responsive UIs ✔
    - takes a number between `1` and `12`

## Types

- [String](#type-string)
- [Number / Float / Int](#type-number)
- [Boolean](#type-boolean)
- [Object](#type-object)
- [Array](#type-array)
- [Null](#type-null)

### Type String

Generic Keywords:

- `format` in own schema (widget must implement it)
- [non-JSON](https://json-schema.org/understanding-json-schema/reference/non_json_data.html) (widget must implement it)
    - `contentMediaType` may be used to change widget behaviour
    - `contentEncoding` may be used to change widget behaviour 

Validation Keywords:

- `pattern` ✔
- `minLength` string min. length ✔
- `maxLength` string max. length ✔

[Specification](https://json-schema.org/understanding-json-schema/reference/string.html)

### Type Number

Numbers can be described as:

- `type: number` integer or float ✔
- `type: integer` only integer ✔
    - uses `Number.isInteger` to check type, may needs polyfill ✔

Validation Keywords:

- `multipleOf` restricts to the multiples of the given number ✔
- `minimum` number min. or same length ✔
- `exclusiveMinimum` number min. length ✔
- `maximum` number max. or same length ✔
- `exclusiveMaximum` number max. length ✔

[Specification](https://json-schema.org/understanding-json-schema/reference/numeric.html)

### Type Boolean

Type validity reports true when of type `boolean`. ✔

For required booleans `false` validates as invalid. ✔

[Specification](https://json-schema.org/understanding-json-schema/reference/boolean.html)

### Type Object

Type validity reports true when: `typeof value === 'object'` for vanilla-JS and `Map.isMap` for immutable. ✔

Generic Keywords:

- `required` an array that contains which properties must be set, the `RequiredValidator` treats empty/false values as `invalid`! ✔
    - invalid are:
        - `array` with a length of `0`, e.g. `[]`, `List([])`
        - `object` where the keys array has a length of `0`, e.g. `{}`, `Map({})`
        - `string` where empty after trim
        - `boolean` where false
        - `number` has no falsy check, invalid when not type of number, (`0` is a valid number, `"0"` is not valid)
        - where the value is `undefined`
    - JSON-Schema difference: instead of only checking for the "existence of the property", we check for a "falsy" value for each type
        - this way it is a more native feeling of HTML form validation, where an empty string is wrong for a required text input 
    - **todo**: add a way to make it "strict" (property existence check without value check) ❌
    - **todo**: add a way to sanitize any value from "loose" to "strict" when updating the values store ❌

Validation Keywords:

- `minProperties` min. number of properties ❌
- `maxProperties` max. number of properties ❌
- `additionalProperties` when `false` only defined properties are allowed ❌
- `propertyNames.pattern` regex pattern to limit naming of properties ❌
- `patternProperties` to restrict names of properties to certain types with regex ❌ 
- [dependencies](./WidgetPlugins.md#dependenthandler) for dynamic sub-schema/properties ❗

[Specification](https://json-schema.org/understanding-json-schema/reference/object.html)

### Type Array

Type validity reports true when: `Array.isArray(value)` for vanilla-JS and `List.isList` for immutable. ✔

Validation Keywords:

- `minItems` min. number of items ✔
- `maxItems` max. number of items ✔
- `uniqueItems` all items must be of an unique value ✔
- `items` restricts all items be valid against a sub-schema (one-all) ✔
    - ❗ only checks some schema: everything [validateSchema](./WidgetPlugins.md#validateschema) supports
    - ❗ no full sub-schema against array items
- `contains` one or more items needs to be valid against a sub-schema ✔
    - ❗ only checks some schema: everything [validateSchema](./WidgetPlugins.md#validateschema) supports
    - ❗ no full sub-schema against array items
- `items` restricts items to be valid against sub-schemas in an defined order (tuple) ❌
    - `additionalItems` if more props then defined are allowed ❌

[Specification](https://json-schema.org/understanding-json-schema/reference/array.html)

### Type Null

Can be used to render some only-text/display widget that will not provide any entry in the resulting data.

Validates true for `null` value but property exists. ❌

[Specification](https://json-schema.org/understanding-json-schema/reference/null.html)

## Schema is Read-Only

The editor doesn't change the schema, currently it is designed as a property that is considered read-only.

Depending on the used 

## Docs

- [Overview](../../README.md)
- [UI-JSON-Schema](./Schema.md)
- [Widget System](./Widgets.md)
- [Widget Plugins](./WidgetPlugins.md)
- [Localization / Translation](./Localization.md)
- [Performance](./Performance.md)
