# UI JSON-Schema

JSON-Schema together with UI-Schema are making it possible to validate data in frontend and backend, create user interfaces and more from a single source of truth.

This page covers the support for JSON-Schema within the core, validators or from plugins.

## Widget Matching

For matching a widget to a schema, these keywords are used:
 
- `type` valid types: `string`, `number`, `integer`, `boolean`, `object`, `array`
    - multi-type support for one schema ❌
    - full support `null` as type ❌
- `widget`, non-standard JSON-Schema to select a specific UI

## Universal Keywords

- `default` what will be used if the field hasn't existing data
    - sets value and renders prop, updates store in effect, the widget will be available directly with the default value
- `enum` restricts the value to a list of values, used in e.g. select to build the selection
    - [specification](https://json-schema.org/understanding-json-schema/reference/generic.html#enumerated-values)
- `const` to restrict the value to a single value
    - when `object` or `array` only works correctly with immutable `List` or `Map`, the initially provided schema and data props are already compatible
    - [specification](https://json-schema.org/understanding-json-schema/reference/generic.html#constant-values)
- `format` e.g. `date` for the `type` `string` *(per widget)*
- `title` what should be used as title, supported by [TransTitle](/docs/localization#example-transtitle)
- `description` should be used as description (e.g. alt description) *(per widget)*
- `$comment` is recommended to leave maintaining notes
- `readOnly` restricts that the a value can not be changed ❌
    - how does this influence `default`?
    - text fields need to support `disabled`, but what for e.g. `GenericList`
    - should the store be `readOnly` aware? so it simply is impossible to change those values?
        - but this could be a really tricky thing with `allOf` and `default`
    - should it be possible to render something completely different for read only?
        - e.g. a table would make sense for a read only `GenericList`/`SimpleList` 
- `writeOnly` restricts that the widget does not display it's value, but can change it ❌
    - should the widget get the value or only something like `isNotEmpty`   

Usage scenario needs to be created:

- structuring, reuse, extension
    - [recursive](https://json-schema.org/understanding-json-schema/structuring.html#recursion) with `$ref` ❌
    - [schema-id](https://json-schema.org/understanding-json-schema/structuring.html#the-id-property) with `$id` and use `$ref` with `$id` to load partial sub-schemas lazily or include relatively ❌
    
>
> target support is JSON-Schema [Draft 2019-09](https://json-schema.org/draft/2019-09/release-notes.html)
>
> extended with non-standard vocabulary for [UI purposes](#ui-schema-extension-of-json-schema)
>
> more about [JSON-Schema keyword support](#json-schema-keyword-support).
>
    
## UI-Schema Extension of JSON-Schema

The JSON-Schema gets extended with special only-UI keywords, take a look a each [widget page](/docs/overview#widget-list) for individual settings and more.

- `view` currently only used for the grid system
- `widget` (see top of page), UI selection
- `t`, `tt` for [translation](/docs/localization#Translation)

More about [UI-Schema keywords](#ui-schema-keywords).

### View Keyword

- `sizeXs`, `sizeSm`, `sizeMd`, `sizeLg`, `sizeXl` to build responsive UIs
    - takes a `number` between `1` and `12`
    - see [GridHandler](/docs/widgets/GridHandler)

## Types

- [String](#type-string)
- [Number / Int](#type-number)
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

- `pattern`
- `minLength` string min. length
- `maxLength` string max. length

[Specification](https://json-schema.org/understanding-json-schema/reference/string.html)

### Type Number

Numbers can be described as:

- `type: number` integer or float
- `type: integer` only integer
    - uses `Number.isInteger` to check type, may needs polyfill

Validation Keywords:

- `multipleOf` restricts to the multiples of the given number
- `minimum` number min. or same length
- `exclusiveMinimum` number min. length
- `maximum` number max. or same length
- `exclusiveMaximum` number max. length

[Specification](https://json-schema.org/understanding-json-schema/reference/numeric.html)

### Type Boolean

Type validity reports true when of type `boolean`.

For required booleans `false` validates as invalid.

[Specification](https://json-schema.org/understanding-json-schema/reference/boolean.html)

### Type Object

Type validity reports true when: `typeof value === 'object'` for vanilla-JS and `Map.isMap` for immutable.

Generic Keywords:

#### required Keyword

- `required`, array that contains which properties must be set!
    - provides a more native feeling of HTML form validation and error display, the internal store updater `updateValue` uses the `required` value to delete the whole property from the object on e.g. an empty string, instead of just saving the empty string 
        - as in a browser: an empty string is wrong for a required text input
    - when required, value "deletion" is triggered by:
        - `array` with a length of `0`, e.g. `[]`, `List([])`
        - `object` where the keys array has a length of `0`, e.g. `{}`, `Map({})`
        - `string` where empty after trim
        - `boolean` where false
        - `number` has no falsy check (`0` is a valid number)
        - where the value is `undefined`

Validation Keywords:

- `minProperties` min. number of properties
- `maxProperties` max. number of properties
- `additionalProperties` when `false` only defined properties are allowed
- `propertyNames` sub-schema to limit naming of properties
- `patternProperties` automatic sub-schema applied to a property when property-name matches regex ❌ 
- [dependencies, dependentSchemas](/docs/plugins#dependenthandler) for dynamic sub-schema/properties
- [if, else, then, allOf](/docs/plugins#conditionalhandler) for conditional sub-schema
- [allOf, with conditionals](/docs/plugins#combininghandler) for combining sub-schema (not-all keywords)

[Specification](https://json-schema.org/understanding-json-schema/reference/object.html)

### Type Array

Type validity reports true when: `Array.isArray(value)` for vanilla-JS and `List.isList` for immutable.

Validation Keywords:

- `minItems` min. number of items
- `maxItems` max. number of items
- `uniqueItems` all items must be of an unique value
- `contains` one or more items needs to be valid against a sub-schema
    - ❗ only checks some schema: everything [validateSchema](/docs/plugins#validateschema) supports
    - ❗ no full sub-schema against array items
- `items` restricts all items be valid against a sub-schema (one-all)
    - ❗ only checks some schema: everything [validateSchema](/docs/plugins#validateschema) supports
    - ❗ no full sub-schema against array items
    - errors are added with context key `arrayItems`
        - only get **non** items errors: 
        - `errors.filter(err => List.isList(err) ? !err.getIn([1, 'arrayItems']) : true)`
- `items` restricts items to be valid against sub-schemas in an defined order (tuple) 
    - `additionalItems` if more props then defined are allowed
    - ❗ currently the individual items must be validated in their actual widgets (validation in render flow)
    - supported by e.g. [GenericList](/docs/widgets/GenericList)

[Specification](https://json-schema.org/understanding-json-schema/reference/array.html)

### Type Null

Can be used to render some only-text/display widget that will not provide any entry in the resulting data.

Validates true for `null` value but property exists. ❌

[Specification](https://json-schema.org/understanding-json-schema/reference/null.html)

## JSON-Schema Keyword Support

Support is JSON-Schema [Draft 2019-09](https://json-schema.org/draft/2019-09/release-notes.html), the possibility to change between versions will be added.

| Group      | Keyword         | Status |
| :---       | :---            | :--- | 
| `general`   | | | 
|            | `readOnly` | per ds |
|            | `writeOnly` | per ds |
|            | `definition` | ❌ |
|            | `$id` | ❌ |
|            | `$ref` | ❌ |
| `type`     | | ✅ | 
|            | `string` | ✅ | 
|            | `number` | ✅ | 
|            | `integer` | ✅ | 
|            | `boolean` | ✅ | 
|            | `array` | ✅ | 
|            | `object` | ✅ |
|            | `null` | 🔵 | 
| **Types** | | |  
| `string`   | | ✅ | 
|            | `format` | ✅ | 
|            | `pattern` | ✅ | 
|            | `minLength` | ✅ | 
|            | `maxLength` | ✅ | 
| `number`/`integer` | | ✅ | 
|            | `multipleOf` | ✅ | 
|            | `minimum` | ✅ | 
|            | `exclusiveMinimum` | ✅ | 
|            | `maximum` | ✅ | 
|            | `exclusiveMaximum` | ✅ | 
| `boolean`  | | ✅ | 
| | only general| | 
| `object`   | | ✅ | 
|            | `properties` | ✅ | 
|            | `required` | ✅ | 
|            | `minProperties` | ✅ | 
|            | `maxProperties` | ✅ | 
|            | `additionalProperties` | ✅ | 
|            | `patternProperties` | ✅ | 
|            | `propertyNames` | ✅ | 
|            | `dependencies` | ✅ | 
|            | `dependencies.oneOf` | ✅ <small>non standard</small> | 
|            | `dependentSchemas` | ✅ | 
|            | `if` | ✅ | 
|            | `else` | ✅ | 
|            | `then` | ✅ | 
|            | `allOf` | ✅ | 
|            | `allOf.if`/`allOf.not` | ✅ | 
|            | `if.not`/`else.not`/`then.not`/`allOf.not` | ✅ | 
|            | `oneOf` | ❌ | 
|            | `anyOf` | ❌ | 
| `array`   | | ✅ | 
|            | `items` | ✅ | 
|            | `minItems` | ✅ | 
|            | `maxItems` | ✅ | 
|            | `uniqueItems` | ✅ | 
|            | `contains` | ✅ | 
|            | `additionalItems` | ✅ | 
| `null`   | | 🔵 |

## UI-Schema Keywords

Typings:

- [`import {JsonSchema} from '@ui-schema/ui-schema'`](https://github.com/ui-schema/ui-schema/blob/master/packages/ui-schema/src/JsonSchema.d.ts)
- [`import {UISchema} from '@ui-schema/ui-schema'`](https://github.com/ui-schema/ui-schema/blob/master/packages/ui-schema/src/UISchema.d.ts)

Vocabularies:

- [View](https://github.com/ui-schema/ui-schema/blob/master/schema/2019-09/meta/view.json)
- [Widget](https://github.com/ui-schema/ui-schema/blob/master/schema/2019-09/meta/widget.json)
- [Translation](https://github.com/ui-schema/ui-schema/blob/master/schema/2019-09/meta/translation.json)
- ...

## Schema is Read-Only

The editor doesn't change the schema, currently it is designed as a property that is considered read-only.

But that's not the whole truth, the schema is manipulated from within the SchemaEditor but the changes are never reflected to the hoisted component.

As the whole rendering is calculated from props/state for each schema-level on it's own, these rendering mechanics may change the schema for it's own or sub-levels. Through this it is e.g. possible to add dynamic properties in the [DependentHandler](/docs/plugins#dependenthandler).
