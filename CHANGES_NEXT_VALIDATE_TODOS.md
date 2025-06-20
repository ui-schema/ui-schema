# Todos for JSON-Schema

> rewrite of validator system and errors
> - logic especially in `/json-schema` and `/react-json-schema`
> - types in system, and validate/errors interop
> - misc in `/react`, `/ds-*`

- `/Validators`
    - [ ] ArrayValidator
        - [x] migrated to `.output`
        - [x] support `recursive`
        - [ ] add params for adding keywordLocation/instanceLocation at all `addError` / verify usage for nested errors
        - [ ] support handling of `prefixItems`
        - [ ] support handling of `prefixItems` with additional `items`
        - [ ] remove type validate inside tuple validation, once clarified why that was added there
    - [x] EmailValidator
        - type: `validate:boolean`
    - [x] MinMaxValidator
        - type: `validate:void`
        - [x] split up by value-type
        - [ ] add params for adding keywordLocation/instanceLocation at all `addError`
    - [x] MultipleOfValidator
        - type: `validate:boolean`
    - [ ] ObjectValidator
        - [x] migrated to `.output`
        - [x] support `recursive`
        - [x] remove included `required` validator, as now separate plugin
        - [x] do recursive `validate` for properties (if enabled)
    - [ ] OneOfValidator
        - [x] migrated to `.output`
        - [x] forced `recursive`
            - [ ] add tests for `recursive`
    - [x] PatternValidator
        - type: `validate:boolean`
    - [ ] RequiredValidator
        - **todo:** unused HTML-like required fn, which works directly on field-level value and not object
    - [x] TypeValidator
        - type: `validate:boolean`
    - [x] ValueValidator
        - [x] ValueValidator-Const
            - type: `validate:boolean`
            - improved object/array/Map/List support
        - [x] ValueValidator-Enum
            - type: `validate:boolean`
    - [ ] NotValidator
        - **todo:** add newly?
- `StandardValidators`
    - [ ] optimize / finalize bindings to `validate` fns
    - **todo:** try to rewrite the way nested validations are done, if the validator could return `deferred` and a `onDeferredDone`
        - it could allow writing a loop inside the main `validate`, which runs all validations instead of recursive stack increase,
          while `onDeferredDone` provides a way to do anything when it was done;
        - this would be complex when the `onDeferredDone` works on each-result and then on the accumulation of it,
          like at `array.contains`
- [ ] incremental hierarchical validation should be checked/tested
    - [x] array/object results checked
    - [x] expand array tests
    - [ ] expand object tests
    - [ ] expand `handleIfElseThen` tests?
    - [ ] expand `oneOfValidator` tests
    - [ ] check any conditional schema, which would never be validated in render flow, and activate recursive
    - ~~e.g. errors on array items are shown on error in list example~~ fixed, prevent `.items` keyword validation if `params.recursive` is false
- [ ] reduce "type checks" and "schema/keyword exists checks" inside validators
    - improve type inference based on `types` assignment of validator-bindings
- [x] add `validate` to UIMetaContext
    - migrate handleIfElseThen/ConditionalHandler/useSchemaCombine to binding from context
- write down effects of adjusted validations, as now more spec compliant
    - `required` works on object, not field -> `if/else/then` on `undefined` value behaves different than on `object
        - no longer has HTML-is-required internally as default
    - `type` now no longer used for some validators, only internal `valueType`
    - validators now are directly tied to `valueType` instead of needing to do such checks internally
    - strict-type validation based on path depth
    - `$ref` and resolving pointer is now more spec compliant, which fixes a lot, but also removes some previous behaviour
        - in `<=0.4.x` the `$ref`: `'#/definitions/person'` and `$ref: '#/$defs/person'`  where treated as the same and resolved by the nearest `definitions` or `$defs`; now those are treated as pointer and not as definition aliases, thus two different schema locations would be tried
- [ ] verify all pass downs of `params` to not pass down e.g. `instanceKey` when switching instances
- [ ] verify all pass downs of `params` to pass down `parentSchema`, for legacy/HTML-like required checks AND not pass it down where it no longer is applicable
- **todo:** rethink/redo validation based on "rendered by schema/value"
    - as rendering happens by schema, `undefined` is often validated, atm. `undefined` skips different validators due to not knowing if really exists
      or if the field just is empty
    - especially `root` should never skip e.g. `type` validation for `undefined`
    - if a field exists, it should be validated, but atm. only known "if not undefined"
      resulting in `if/then/else` not correctly handling type-mismatches
    - if a field does not exist, it shouldn't be validated at all, except through keywords from the parent, which target it
    - conclusion:
        - atm. this is only possible inside `handleIfElseThen`
        - full support requires full-store validation and not incremental,
          or when the incremental gets more meta information, e.g. `valueExists` in `object` on `property` level could "turn validation on" for that property;
        - workaround: using `path.length` to switch to strict-type-validate, using `instanceLocation: []` for `handleIf`,
          which fails for `undefined` if anything is defined in `type` keyword
        - **todo:** add path expansion inside current validators
    - AJV behaves inconsistent with `undefined`
        - if the root is `undefined` and has no `type`: valid
        - if the root is `undefined` and has `type: 'object'`: invalid
        - if a property `demo` is `undefined` and has `type: 'string'`: valid

## Types Of Validators

- `validate:boolean` - uses arguments and only provided `false|true` returns if valid or not
- `validate:output` - provides `output` to be consumed like needed, not added to `state.output`
- `validate:void` - adds errors directly to `state.output`

## Docs

> Replace related docs with new ones. Following is an initial scribble.

#### Overview

The `Validator` system is a flexible, incremental, hierarchical validation framework built in TypeScript, designed for high extensibility and ease of use. It supports pluggable, deferred validation logic, making it perfect for use cases involving complex schema validations, such as data validation in applications or form handling.

The validator can integrate with any data/rendering engine, while providing a rich developer experience (DX) with type-safe API signatures, intuitive error handling, and simple integration of custom validation plugins.

This guide explains the core API, usage examples, and how to extend the system with custom plugins.

### Key Features

- **Incremental Validation**: Supports cascading, hierarchical validation
- **Pluggable Plugins**: Easy to add custom validation logic via plugins
- **TypeScript Support**: Type-safe validation with detailed error reporting
- **State Management**: Isolates errors per validation call and enables deferred processing
- **Built-in Validators**: Standard validation plugins

### Core API

#### validator.validateValue

This function is the primary entry point for validation. It performs the validation for a given `value` based on a `schema` and returns a boolean indicating whether the value is valid. Type assertion is applied to ensure that developers can use the result as the specified type.

```ts
function validateValue<TData>(schema: any, value: any): value is TData
```

- **`schema`**: The schema that describes the validation logic (can be a custom schema or one of the predefined standard schemas).
- **`value`**: The value to validate against the schema.
- **Returns**: A boolean indicating whether the value passes validation (`true` for valid, `false` for invalid). Type assertions are provided for the value after validation (`value is TData`).

##### Example

```ts
const schema = {type: 'string', minLength: 3}
const value = 'Hello'

if(validator.validateValue(schema, value)) {
    console.log('Value is valid')
} else {
    console.log('Value is invalid')
}
```

#### validator.validateValue.errors

This is a state variable on the `validateValue` function that stores the errors from the last validation. It is reset after each validation call, meaning it should only be used in synchronous logic.

```ts
const schema = {type: 'string'}
const value = 123

validator.validateValue(schema, value)
if(validator.validateValue.errors) {
    console.log('Validation failed with errors:', validator.validateValue.errors)
}
```

#### validator.validate

This function is an alternative to `validateValue`, offering more detailed results. It returns a result object indicating whether the validation succeeded or failed, including errors when validation fails.

```ts
type validate<TData> =
    (schema: any, value: any, params?: ValidateParams, outerState?: ValidateState) =>
        { valid: true, value: TData, errors?: never } |
        { valid: false, errors?: any[] }
```

- **`schema`**: The schema to validate against.
- **`value`**: The value to be validated.
- **`params`**: Additional parameters that can be passed into the validation (optional).
- **`outerState`**: The external state passed down from the caller (optional, for nested validations).

##### Returns:

- If validation is successful: `{ valid: true, value: TData }`
- If validation fails: `{ valid: false, errors: Array }` containing error details.

##### Example

```ts
const schema = {type: 'number', minimum: 10}
const value = 5

const result = validator.validate(schema, value, {}, {})

if(result.valid) {
    console.log('Valid value:', result.value)
} else {
    console.log('Errors:', result.errors)
}
```

### Plugin System

The validation system is highly extensible via plugins. Plugins can define custom validation rules and operate on the same API as the core validation functions, ensuring consistency across the system.

Each plugin should implement the `ValidatorHandler` type.

#### ValidatorHandler

The signature for each validation plugin looks like this:

```ts
export type ValidatorHandler<TTypes extends JsonSchemaKeywordType[] | undefined = JsonSchemaKeywordType[] | undefined> = {
    types?: TTypes;
    validateValue: (
        schema: any,
        value: any,
        params: ValidateParams,
        state: ValidateState
    ) => void;
}
```

- **`types`**: Optional array of schema types this handler applies to (e.g., `string`, `number`, etc.).
- **`validateValue`**: The function where the actual validation logic is implemented.

### Using the Validator

To use the validator system in your project, you can integrate it like so:

```ts
import { standardValidators } from '@ui-schema/json-schema/StandardValidators'
import { Validator } from '@ui-schema/json-schema/Validator'

const validator = Validator(standardValidators)

const schema = fromJSOrdered({type: 'string'})
const data = 'lorem'

// then use one of the validator functions:
const result = validator.validateValue(schema, data)
const valid = validator.validate(schema, data)
```

This imports the `Validator` function and a set of standard validators, then allows you to validate data according to predefined schemas.

### Extending the Validator

To add custom validation logic, create a new plugin by defining a handler for the validation process. The handler can be registered alongside the standard validators.

#### Creating a Custom Validator Handler

Define the validation logic:

```ts
const customValidatorHandler = {
    validateValue: (schema, value, _params, state) => {
        if(typeof value !== 'string') {
            state.output.addError({error: 'not-a-string'})
        }
    },
}
```

Integrate it with the validator:

```ts
const customValidators = [...standardValidators, customValidatorHandler]
const customValidator = Validator(customValidators)
```

