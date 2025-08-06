# JSON Schema + UI

JSON Schema makes it possible to validate data in frontend and backend, use UI Schema to automatically create nice user interfaces from a single source of truth.

This page covers the support for JSON Schema within the core, validators or from plugins.

**JSON Schema versions supported:** Draft 2019-09 / Draft-08, Draft-07, Draft-06, Draft-04, [keyword support table](#json-schema-keyword-support).

## Widget Matching

Matches the rendered widget, keywords used:

- `type` valid types: `string`, `number`, `integer`, `boolean`, `object`, `array`, `null`
    - including multiple types support *(see [happy path infos](/docs/widgets-composition#example-for-multiple-types))*
        - e.g.: use `"type": ["string", "null"], "default": null` for nullable array items
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
- `title` what should be used as title, supported by [TranslateTitle](/docs/localization#example-TranslateTitle)
- `description` should be used as description (e.g. alt description) *(per widget)*
- `$comment` is recommended to leave maintaining notes
- `readOnly` restricts that the a value can not be changed [issue #33](https://github.com/ui-schema/ui-schema/issues/33)
    - currently:
        - does not influence `default`
        - for SimpleList/GenericList only for the array level, if also the values must be read only, the keyword must be set on all
        - doesn't do anything for `object`
    - with `ReadMeta` and special widgets, it is possible to render something different then
- `writeOnly` restricts that the widget does not display it's value, but can change it ❌
    - should the widget get the value or only something like `isNotEmpty`? how should it be validated?
- [structuring, reuse, extension](https://json-schema.org/understanding-json-schema/structuring.html#recursion)
    - in-schema reuse with `$defs`/`definitions`, `$id`, `$ref` etc. [ReferencingHandler](/docs/plugins#referencinghandler)
    - schema-id with `$id` and use `$ref` with `$id`
    - load schemas lazily from any API, [ReferencingNetworkHandler](/docs/plugins#referencingnetworkhandler)
- `oneOf` for "one-schema must match" validation, only usable with specific widgets
    - supported by e.g. [`SelectChips`](/docs/widgets/SelectChips)

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
    - this library provides a more native feeling of HTML form validation and error display, the store updater uses the `required` keyword and `type` to delete the whole property from the object on e.g. an empty string, instead of just saving the empty string
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
- `items` restricts all items be valid against a sub-schema (one schema for all or tuples)
    - nested schemas must be validated in render tree
        - supported by `ds-material`
        - supported by `isVirtual`/`VirtualWidgetRenderer`
    - errors are added with context key `arrayItems`
        - only get **non** items errors:
        - `errors.getErrors()`, `errors.getChildErrors()`
    - restricts items to be valid against
        - sub-schemas in a defined order (tuple)
        - one-schema for all items
    - `additionalItems` if more props then defined are allowed
    - the individual items must be validated in their actual widgets, e.g. done in the `PluginStack` per item rendered by `GenericList`
    - supported by e.g. [GenericList](/docs/widgets/GenericList), [Table](/docs/widgets/Table)
- `prefixItems` is new in Draft 2019-09 for tuple validation, replacing `items` when `items` is an array.
- **restrictions:**
    - `null`/`undefined` behaviour [#106](https://github.com/ui-schema/ui-schema/issues/106)

[Specification](https://json-schema.org/understanding-json-schema/reference/array.html)

### Type Null

Can be used to render some only-text/display widget that will not provide any entry in the resulting data.

Validates true for `null` values.

Renders `null`, really nothing, but can be overwritten `widgets.types.null` to render anything. The plugins will still render, e.g. the grid plugin.

[Specification](https://json-schema.org/understanding-json-schema/reference/null.html)

## JSON-Schema Keyword Support

Supported JSON-Schema versions and what currently isn't supported.

- [Draft 2020-12](https://json-schema.org/draft/2020-12/release-notes.html) [changelog](https://json-schema.org/draft/2020-12/json-schema-core.html#rfc.appendix.G) **latest** ❌
- [Draft 2019-09 / Draft-08](https://json-schema.org/draft/2019-09/release-notes.html)
    - link resolution for multiple of draft-07 is incompatible to 2019-09, but currently not implemented at all
- [Draft-07](https://json-schema.org/draft-07/json-schema-release-notes.html) differences marked in table
- [Draft-06](https://json-schema.org/draft-06/json-schema-release-notes.html) differences marked in table
- [Draft-04](https://json-schema.org/draft-06/json-schema-release-notes.html)
    - defines `exclusiveMaximum`, `exclusiveMinimum` as boolean, then works together with `minimum`/`maximum`
    - defines `integer` as true integer, whereas from Draft-06 onwards also `1.0` is valid, currently always like Draft-06, but JS internally saves `1.0` also only as `1`, thus correct saving and display of values even when received wrong
    - defines any-where usage of `$ref`, e.g. properties can't be named `$ref` as it should resolve, only supports `$ref` where a schema is expected (like from draft-06 onwards) ❌

Validators for latest version are used by default, incompatible changes are solved from the validator (e.g. different namings), the possibility to change/replace validators completely will be added.

For latest issues/questions checkout the [github issues](https://github.com/ui-schema/ui-schema/issues).

| Spec.                                                  | Group              | Keyword                   | Status                 |
|:-------------------------------------------------------|:-------------------|:--------------------------|:-----------------------|
| json-schema-core [^1] <br> json-schema-validation [^2] |                    |                           |                        |
| core                                                   |                    | `$comment`                |                        |
| validation                                             |                    | `readOnly`                | per widget / extension |
| validation                                             |                    | `writeOnly`               | per widget / extension |
| core                                                   |                    | `definitions`/`$defs`     | ✅                      |
| core, till draft-06, till draft-07 for anything        |                    | `id`/`$id`                | ✅                      |
| core, from 2019-09                                     |                    | `$anchor`                 | ✅                      |
| core                                                   |                    | `$ref`                    | ✅                      |
| core                                                   |                    | `$recursiveAnchor`        | ❌                      |
| core                                                   |                    | `$recursiveRef`           | ❌                      |
| validation                                             | *commons*          | `enum`                    | ✅                      |
| validation                                             | *commons*          | `const`                   | ✅                      |
| validation                                             | *commons*          | `default`                 | ✅                      |
| validation                                             | `type`             | `string`                  | ✅                      |
| validation                                             | `type`             | `number`                  | ✅                      |
| validation                                             | `type`             | `integer`                 | ✅                      |
| validation                                             | `type`             | `boolean`                 | ✅                      |
| validation                                             | `type`             | `array`                   | ✅                      |
| validation                                             | `type`             | `object`                  | ✅                      |
| validation                                             | `type`             | `null`                    | ✅                      |
|                                                        | `string`           |                           | ✅                      |
| validation                                             |                    | `format`                  | per widget             |
| validation                                             |                    | `pattern`                 | ✅                      |
| validation                                             |                    | `minLength`               | ✅                      |
| validation                                             |                    | `maxLength`               | ✅                      |
| core                                                   |                    | `contentEncoding`         | per widget             |
| core                                                   |                    | `contentMediaType`        | per widget             |
|                                                        | `number`/`integer` |                           |                        |
| validation                                             |                    | `multipleOf`              | ✅                      |
| validation                                             |                    | `minimum`                 | ✅                      |
| validation                                             |                    | `exclusiveMinimum`        | ✅                      |
| validation                                             |                    | `maximum`                 | ✅                      |
| validation                                             |                    | `exclusiveMaximum`        | ✅                      |
|                                                        | `boolean`          |                           |                        |
|                                                        |                    | no type specific keywords |                        |
|                                                        | `object`           |                           |                        |
| core                                                   |                    | `properties`              | ✅                      |
| validation                                             |                    | `required`                | ✅                      |
| validation                                             |                    | `minProperties`           | ✅                      |
| validation                                             |                    | `maxProperties`           | ✅                      |
| core                                                   |                    | `additionalProperties`    | ✅                      |
| core                                                   |                    | `patternProperties`       | ❌                      |
| core                                                   |                    | `unevaluatedProperties`   | ✅                      |
| core                                                   |                    | `propertyNames`           | ✅                      |
| validation, till draft-07                              |                    | `dependencies`            | ✅                      |
| core, from 2019-09                                     |                    | `dependentSchemas`        | ✅                      |
| core, from 2019-09                                     |                    | `dependentRequired`       | ✅                      |
| core                                                   |                    | `if`                      | ✅                      |
| core                                                   |                    | `else`                    | ✅                      |
| core                                                   |                    | `then`                    | ✅                      |
| core                                                   |                    | `allOf`                   | ✅                      |
| core                                                   |                    | `not`                     | ✅                      |
| core                                                   |                    | `oneOf`                   | ✅                      |
| core                                                   |                    | `anyOf`                   | ✅                      |
|                                                        | `array`            |                           |                        |
| core                                                   |                    | `items`                   | ✅                      |
| core, from 2020-12                                     |                    | `prefixItems`             | ✅                      |
| core                                                   |                    | `unevaluatedItems`        | ❌                      |
| validation                                             |                    | `minItems`                | ✅                      |
| validation                                             |                    | `maxItems`                | ✅                      |
| validation                                             |                    | `uniqueItems`             | ✅                      |
| validation                                             |                    | `maxContains`             | ✅                      |
| validation                                             |                    | `minContains`             | ✅                      |
| core                                                   |                    | `contains`                | ✅                      |
| core                                                   |                    | `additionalItems`         | ✅                      |
|                                                        | `null`             |                           | ✅                      |

[^1]: [json-schema-core](https://json-schema.org/draft/2019-09/json-schema-core.html)

[^2]: [json-schema-validation](https://json-schema.org/draft/2019-09/json-schema-validation.html)

❌ = not implemented, ✅ = done

## UI-Schema Keywords

UI Schema extends JSON Schema with special only-UI keywords, take a look at each [widget page](/docs/overview#widget-list) for individual settings and more.

- `view` used for the grid and visual settings, see [view keyword](#view-keyword) and each widget
- `widget` (see top of page), UI selection / widget matching
- `t`, `tt`, `ttEnum` for [translation](/docs/localization#Translation)
- `hidden` for virtualization see [hidden keyword](#hidden-keyword--virtualization)

Typings:

- [`import {JsonSchema} from '@ui-schema/ui-schema'`](https://github.com/ui-schema/ui-schema/blob/main/packages/ui-schema/src/JsonSchema.d.ts)
- [`import {UISchema} from '@ui-schema/ui-schema'`](https://github.com/ui-schema/ui-schema/blob/main/packages/ui-schema/src/UISchema.d.ts)

Vocabularies (**not up to date**):

- [View](https://github.com/ui-schema/ui-schema/blob/main/schema/2019-09/meta/view.json)
- [Widget](https://github.com/ui-schema/ui-schema/blob/main/schema/2019-09/meta/widget.json)
- [Translation](https://github.com/ui-schema/ui-schema/blob/main/schema/2019-09/meta/translation.json)
- ...

### View Keyword

- `sizeXs`, `sizeSm`, `sizeMd`, `sizeLg`, `sizeXl` to build responsive UIs
    - takes a `number` between `1` and `12` (for typical 12-column grid systems)
    - any schema root, where a widget may be rendered
    - see [GridHandler](/docs/widgets/GridHandler) for details and demo schemas

```json
{
    "view": {
        "sizeXs": 12,
        "sizeSm": 6,
        "sizeMd": 7,
        "sizeLg": 8,
        "sizeXl": 9
    }
}
```

### Hidden Keyword / Virtualization

When the `hidden: true` keyword is applied to any schema, the `WidgetEngine` and included `WidgetRenderer` and plugins don't render any HTML, producing no output in the page, but still renders and executes the plugins and validators - thus rendering it virtually.

The prop `isVirtual` can be passed to the per schema-level components, like `PluginStack`, `WidgetRenderer` to render them virtual from within an e.g. widget.

The `SchemaGridHandler` plugin of the design-system and any other plugin needs to support it, the official provided design systems and plugins are compatible.

This relies on the `binding.VirtualRenderer`, set it to e.g. `import { VirtualWidgetRenderer } from '@ui-schema/react/VirtualWidgetRenderer'`, otherwise the `WidgetRenderer` will render `null`.

## Schema is Read-Only

The generator doesn't change the schema, currently it is designed as a property that is considered read-only.

But that's not the whole truth, the schema is manipulated from within the UIGenerator but the changes are never reflected to the hoisted component.

As the whole rendering is calculated from props/state for each schema-level on it's own, these rendering mechanics may change the schema for it's own or sub-levels. Through this it is e.g. possible to add dynamic properties in the [DependentHandler](/docs/plugins#dependenthandler).
