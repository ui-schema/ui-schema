# Validator

JSON Schema validator, opinionated for UI generation - which [needs to apply schema on non-existing data](/docs/widgets-composition#happy-path), unlike normal validators.

> todo: Replace related docs with new ones. Following is an initial scribble.

The `Validator` system is a flexible, incremental, hierarchical validation framework built in TypeScript, designed for high extensibility and ease of use. It supports pluggable, deferred validation logic, making it perfect for use cases involving complex schema validations, such as data validation in applications or form handling.

The validator can integrate with any data/rendering engine, while providing a rich developer experience (DX) with type-safe API signatures, intuitive error handling, and simple integration of custom validation plugins.

This guide explains the core API, usage examples, and how to extend the system with custom plugins.

## Key Features

- **Incremental Validation**: Supports cascading, hierarchical validation
- **Pluggable Plugins**: Easy to add custom validation logic via plugins
- **TypeScript Support**: Type-safe validation with detailed error reporting
- **State Management**: Isolates errors per validation call and enables deferred processing
- **Built-in Validators**: Standard validation plugins

## Types Of Validators

- `validate:boolean` - uses arguments and only provided `false|true` returns if valid or not
- `validate:output` - provides `output` to be consumed like needed, not added to `state.output`
- `validate:void` - adds errors directly to `state.output`

## Core API

### validator.validateValue

This function is the primary entry point for validation. It performs the validation for a given `value` based on a `schema` and returns a boolean indicating whether the value is valid. Type assertion is applied to ensure that developers can use the result as the specified type.

```ts
function validateValue<TData>(schema: any, value: any): value is TData
```

- **`schema`**: The schema that describes the validation logic (can be a custom schema or one of the predefined standard schemas).
- **`value`**: The value to validate against the schema.
- **Returns**: A boolean indicating whether the value passes validation (`true` for valid, `false` for invalid). Type assertions are provided for the value after validation (`value is TData`).

#### Example

```ts
const schema = {type: 'string', minLength: 3}
const value = 'Hello'

if(validator.validateValue(schema, value)) {
    console.log('Value is valid')
} else {
    console.log('Value is invalid')
}
```

### validator.validateValue.errors

This is a state variable on the `validateValue` function that stores the errors from the last validation. It is reset after each validation call, meaning it should only be used in synchronous logic.

```ts
const schema = {type: 'string'}
const value = 123

validator.validateValue(schema, value)
if(validator.validateValue.errors) {
    console.log('Validation failed with errors:', validator.validateValue.errors)
}
```

### validator.validate

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

#### Returns:

- If validation is successful: `{ valid: true, value: TData }`
- If validation fails: `{ valid: false, errors: Array }` containing error details.

#### Example

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

## Plugin System

The validation system is highly extensible via plugins. Plugins can define custom validation rules and operate on the same API as the core validation functions, ensuring consistency across the system.

Each plugin should implement the `ValidatorHandler` type.

### ValidatorHandler

The signature for each validation plugin looks like this:

```ts
import { ValidatorParams, ValidatorState, ValidatorHandler } from '@ui-schema/json-schema/Validator'
import { ValidationDetails } from '@ui-schema/ui-schema/Validate'

export type ValidatorHandler<TTypes extends JsonSchemaKeywordType[] | undefined = JsonSchemaKeywordType[] | undefined> = {
    types?: TTypes;
    validate: (
        schema: any,
        value: any,
        params: ValidatorParams & ValidatorState,
    ) => void | ValidationDetails;
}
```

- **`types`**: Optional array of schema types this handler applies to (e.g., `string`, `number`, etc.).
- **`validate`**: The function where the actual validation logic is implemented.

### Creating a Custom Validator Handler

To add custom validation logic, create a new plugin by defining a handler for the validation process. The handler can be registered alongside the standard validators.

Define the validation logic:

```ts
const customValidatorHandler = {
    validate: (schema, value, params) => {
        if(typeof value !== 'string') {
            params.output.addError({error: 'not-a-string'})
        }
    },
}
```

Integrate it with the validator:

```ts
const customValidators = [...standardValidators, customValidatorHandler]
const customValidator = Validator(customValidators)
```

## Using the Validator

To use the validator system in your project, you can integrate it like so:

```ts
import { standardValidators } from '@ui-schema/json-schema/StandardValidators'
import { Validator } from '@ui-schema/json-schema/Validator'

const validator = Validator(standardValidators)

const schema = fromJSOrdered({type: 'string'})
const data = 'lorem'

// then use one of the validator functions:
const valid = validator.validateValue(schema, data)
const result = validator.validate(schema, data)
```

This imports the `Validator` function and a set of standard validators, then allows you to validate data according to predefined schemas.
