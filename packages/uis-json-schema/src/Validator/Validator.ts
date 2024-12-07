import { JsonSchemaKeywordType } from '@ui-schema/json-schema/Definitions'
import { ValidateFn, ValidateParams, ValidateStateNested, ValidateStateOutput, ValidationDetails } from '@ui-schema/system/Validate'
import { ValidatorOutput } from '@ui-schema/system/ValidatorOutput'
import { getValueType } from './getValueType.js'

export type ValidatorStateNested =
    ValidateStateNested

export type ValidatorStateOutput =
    ValidateStateOutput

export type ValidatorState =
    ValidatorStateNested &
    ValidatorStateOutput

type TypeMap = {
    string: string
    number: number
    boolean: boolean
    null: null
    array: unknown[]
    object: object
}

export type MappedType<TTypes extends JsonSchemaKeywordType[]> =
    TTypes[number] extends infer U ?
        U extends keyof TypeMap ? TypeMap[U] : never
        : never

export type ValidatorHandler<TTypes extends JsonSchemaKeywordType[] | undefined = JsonSchemaKeywordType[] | undefined> = {
    /**
     * unique ID of a validator, only the last one will be kept
     */
    id?: string
    types?: TTypes
    validate: (
        schema: any,
        value: any,
        // value: TTypes extends undefined ? any : MappedType<Exclude<TTypes, undefined>>,
        params: ValidatorParams,
        state: ValidatorState,
    ) => void | ({
        // not yet evaluated nested
        // todo: implement
        open?: any[]
        // depending on resolving of another schema
        // todo: implement
        deferred?: any
    } & ValidationDetails)
}

type ValidatorsRegister = {
    /**
     * validators which are active depending on type of the value
     */
    valueHandlers: Map<string, ValidatorHandler['validate'][]>
    /**
     * validators which run everytime, they must decide internally if they should handle validation
     */
    handlers: ValidatorHandler['validate'][]
}

function deduplicateByLast<T extends { id?: string }>(array: T[]): T[] {
    const map = new Map<string | Symbol, T>()

    for (const item of array) {
        map.set(item.id || Symbol(), item)
    }

    return Array.from(map.values())
}

export function createRegister(
    validators: ValidatorHandler[],
) {
    const register = deduplicateByLast(validators).reduce<ValidatorsRegister>((register, validator) => {
        if (validator.types) {
            validator.types?.forEach((type) => {
                if (!register.valueHandlers.has(type)) {
                    register.valueHandlers.set(type, [])
                }
                register.valueHandlers.get(type)!.push(validator.validate)
            })
        } else {
            register.handlers.push(validator.validate)
        }

        return register
    }, {
        valueHandlers: new Map(),
        handlers: [],
        // @ts-expect-error hidden/internal fn
        toJSON() {
            return registerToJSON(register, validators)
        },
    })

    return register
}

export function makeParams(): ValidatorParams {
    return {
        instanceLocation: [],
        keywordLocation: [],
    }
}

export type ValidatorParams =
    ValidateParams

export type ValidateFnTypeAssert = {
    <TData = unknown>(
        schema: any,
        value: unknown,
        params?: ValidatorParams,
    ): value is TData

    errors: ValidatorOutput['errors']
    annotations: unknown[]
}

export function Validator(
    validators: ValidatorHandler[],
): {
    validate: ValidateFn
    validateValue: ValidateFnTypeAssert
} {
    const register = createRegister(validators)

    function validate<TData = unknown>(
        schema: any,
        value: unknown,
        params: ValidatorParams = makeParams(),
        outerState?: Partial<ValidatorState>,
    ): { valid: true, value: TData, errors?: never } | { valid: false, errors: ValidatorOutput['errors'] } {
        const state: ValidatorState = {
            ...outerState || {},
            output: outerState?.output || new ValidatorOutput(),
            validate: outerState?.validate || validate,
        }

        for (const validator of register.handlers) {
            validator(schema, value, params, state)
        }

        const valueType = getValueType(value)

        if (valueType) {
            const validators = register.valueHandlers.get(valueType)
            if (validators) {
                for (const validator of validators) {
                    validator(schema, value, params, state)
                }
            }
        }

        if (state.output.errCount) {
            return {
                valid: false,
                errors: state.output.errors,
            }
        }

        return {
            valid: true,
            value: value as TData,
        }
    }

    const validateValue: ValidateFnTypeAssert = function <TData = unknown>(
        schema: any,
        value: unknown,
        params?: ValidatorParams,
        // todo: support `resource` with and without schema
    ): value is TData {
        const output = new ValidatorOutput()
        // reset state on each call, as sync it is safe against leaking/corruption this way
        validateValue.errors = output.errors
        validateValue.annotations = output.annotations
        return validate(schema, value, params, {output: output}).valid
    }
    validateValue.errors = []
    validateValue.annotations = []

    return {
        validateValue: validateValue,
        validate: validate,
    }
}

function mapToObject<K, V>(
    map: Map<K, V>,
    valueConverter: (value: V) => any,
): Record<string, any> {
    const obj: Record<string, any> = {}
    for (const [key, value] of map.entries()) {
        obj[String(key)] = valueConverter(value)
    }
    return obj
}

function serializeValidatorsArray(validatorFns: ValidatorHandler['validate'][]) {
    return function serializeValidatorsArray2(validators: ValidatorHandler['validate'][]): string[] {
        return validators.map((v) => `[Validator Function ${validatorFns.indexOf(v)}]`)
    }
}

const registerToJSON = (
    register: ValidatorsRegister,
    validators: ValidatorHandler[],
): Record<string, any> => {
    const validatorFns = validators.map(v => v.validate)
    return {
        valueHandlers: mapToObject(register.valueHandlers, serializeValidatorsArray(validatorFns)),
        handlers: serializeValidatorsArray(validatorFns)(register.handlers),
    }
}