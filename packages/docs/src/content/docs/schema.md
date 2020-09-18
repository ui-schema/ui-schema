# UI JSON Schema

JSON Schema together with UI Schema are making it possible to validate data in frontend and backend, create user interfaces and more from a single source of truth.

This page covers the support for JSON Schema within the core, validators or from plugins.

**JSON Schema versions supported:** Draft 2019-09 / Draft-08, Draft-07, Draft-06, Draft-04

## Widget Matching

Matches the rendered widget, keywords used:

- `type` valid types: `string`, `number`, `integer`, `boolean`, `object`, `array`
    - multiple types support ❌
    - full support `null` as type ❌
- `widget` non-standard JSON-Schema to select a specific UI widget

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
- [structuring, reuse, extension](https://json-schema.org/understanding-json-schema/structuring.html#recursion)
    - recursive with `$ref`
    - schema-id with `$id` and use `$ref` with `$id`
        - to load partial sub-schemas lazily ❌
        - include relatively

>
> extended with non-standard vocabulary for [UI purposes](#ui-schema-keywords)
>
> more about [JSON-Schema keyword support](#json-schema-keyword-support).
>

## Types

The JSON-Schema keywords which are only available on a specific type, for official docs and examples see 'specification' at each block.

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

- `required`, array that contains which properties must be set
    - this library provides a more native feeling of HTML form validation and error display, the internal store updater `updateValue` uses the `required` value to delete the whole property from the object on e.g. an empty string, instead of just saving the empty string
        - as in a browser: an empty string is wrong for a required text input - whereas in json-schema an empty string is valid
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
- [dependencies, dependentSchemas, dependentRequired](/docs/plugins#dependenthandler) for dynamic sub-schema/properties
- [if, else, then, not, allOf](/docs/plugins#conditionalhandler) for conditional sub-schema
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
        - `errors.getErrors()`, `errors.getChildErrors()`
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

Supported JSON-Schema versions and what currently isn't supported.

- [Draft 2019-09 / Draft-08](https://json-schema.org/draft/2019-09/release-notes.html) **latest**
    - link resolution for multiple of draft-07 is incompatible to 2019-09, but currently not implemented at all
- [Draft-07](https://json-schema.org/draft-07/json-schema-release-notes.html)
- [Draft-06](https://json-schema.org/draft-06/json-schema-release-notes.html)
- [Draft-04](https://json-schema.org/draft-06/json-schema-release-notes.html)
    - defines `exclusiveMaximum`, `exclusiveMinimum` as boolean, then works together with `minimum`/`maximum`
    - defines `integer` as true integer, whereas from Draft-06 onwards also `1.0` is valid, currently always like Draft-06 ❌

Validators for latest version are used by default, incompatible changes are solved from the validator (e.g. different namings), the possibility to change/replace validators completely will be added.

| Spec. | Group      | Keyword         | Status |
| :---  | :---       | :---            | :--- |
| [json-schema-core](https://json-schema.org/draft/2019-09/json-schema-core.html) <br> [json-schema-validation](https://json-schema.org/draft/2019-09/json-schema-validation.html) | | | nearly complete |
| core |                  | `$comment` | |
| validation |            | `readOnly` | per widget |
| validation |            | `writeOnly` | per widget |
| core |                  | `definitions`/`$def` | ✅ |
| core, till draft-07 |   | `id`/`$id`<br>only relative | ✅ |
| core, from 2019-09 |    | `$anchor` | ✅ |
| core |                  | `$ref`<br>only relative | ✅ |
| core |                  | `$recursiveAnchor` | ❌ |
| core |                  | `$recursiveRef` | ❌ |
| validation |            | `enum` | ✅ |
| validation |            | `const` | ✅ |
| validation |            | `default` | ✅ |
| validation | `type`     | | ✅ |
| |            | `string` | ✅ |
| |            | `number` | ✅ |
| |            | `integer` | ✅ |
| |            | `boolean` | ✅ |
| |            | `array` | ✅ |
| |            | `object` | ✅ |
| |            | `null` | ❌ |
| | **Types** | | |
| | `string`   | | ✅ |
| validation |            | `format` | per widget |
| validation |            | `pattern` | ✅ |
| validation |            | `minLength` | ✅ |
| validation |            | `maxLength` | ✅ |
| core |                  | `contentEncoding` | per widget |
| core |                  | `contentMediaType` | per widget |
| | `number`/`integer` | | |
| validation |            | `multipleOf` | ✅ |
| validation |            | `minimum` | ✅ |
| validation |            | `exclusiveMinimum` | ✅ |
| validation |            | `maximum` | ✅ |
| validation |            | `exclusiveMaximum` | ✅ |
| | `boolean`  | | |
| | | no type specific keywords | |
| | `object`   | | |
| core |                  | `properties` | ✅ |
| validation |            | `required` | ✅ |
| validation |            | `minProperties` | ✅ |
| validation |            | `maxProperties` | ✅ |
| core |                  | `additionalProperties` | ✅ |
| core |                  | `patternProperties` | ❌ |
| core |                  | `unevaluatedProperties` | ❌ |
| core |                  | `propertyNames` | ✅ |
| validation, till draft-07 |            | `dependencies` | ✅ |
| core, from 2019-09 |            | `dependentSchemas` | ✅ |
| core, from 2019-09 |            | `dependentRequired` | ✅ |
| core |            | `if` | ✅ |
| core |            | `else` | ✅ |
| core |            | `then` | ✅ |
| core |            | `allOf` | ✅ |
| core |            | `allOf.if`/`allOf.not` | ✅ |
| core |            | `if.not`/`else.not`/`then.not`/`allOf.not` | ✅ |
| core |            | `oneOf` | ❌ |
| core |            | `anyOf` | ❌ |
| | `array`    | |  |
| core |            | `items` | ✅ |
| core |            | `unevaluatedItems` | ❌ |
| validation |            | `minItems` | ✅ |
| validation |            | `maxItems` | ✅ |
| validation |            | `uniqueItems` | ✅ |
| validation |            | `maxContains` | ✅ |
| validation |            | `minContains` | ✅ |
| core |            | `contains` | ✅ |
| core |            | `additionalItems` | ✅ |
| | `null`   | | ❌ |
| [JSON-Schema Hypermedia](https://json-schema.org/draft/2019-09/json-schema-hypermedia.html) [examples](https://json-schema.org/draft/2019-09/json-schema-hypermedia.html#examples) | | | ❌ |
| hyper |            | `base` | ❌ |
| hyper |            | `links` | ❌ |

❌ = not implemented, ✅ = done

## UI-Schema Keywords

UI Schema extends JSON Schema with special only-UI keywords, take a look a each [widget page](/docs/overview#widget-list) for individual settings and more.

- `view` used for the grid system
- `widget` (see top of page), UI selection / widget matching
- `t`, `tt` for [translation](/docs/localization#Translation)

Typings:

- [`import {JsonSchema} from '@ui-schema/ui-schema'`](https://github.com/ui-schema/ui-schema/blob/master/packages/ui-schema/src/JsonSchema.d.ts)
- [`import {UISchema} from '@ui-schema/ui-schema'`](https://github.com/ui-schema/ui-schema/blob/master/packages/ui-schema/src/UISchema.d.ts)

Vocabularies:

- [View](https://github.com/ui-schema/ui-schema/blob/master/schema/2019-09/meta/view.json)
- [Widget](https://github.com/ui-schema/ui-schema/blob/master/schema/2019-09/meta/widget.json)
- [Translation](https://github.com/ui-schema/ui-schema/blob/master/schema/2019-09/meta/translation.json)
- ...

### View Keyword

- `sizeXs`, `sizeSm`, `sizeMd`, `sizeLg`, `sizeXl` to build responsive UIs
    - takes a `number` between `1` and `12`
    - see [GridHandler](/docs/widgets/GridHandler)

## Schema is Read-Only

The generator doesn't change the schema, currently it is designed as a property that is considered read-only.

But that's not the whole truth, the schema is manipulated from within the UIGenerator but the changes are never reflected to the hoisted component.

As the whole rendering is calculated from props/state for each schema-level on it's own, these rendering mechanics may change the schema for it's own or sub-levels. Through this it is e.g. possible to add dynamic properties in the [DependentHandler](/docs/plugins#dependenthandler).
