import { ValidatorOutput } from '@ui-schema/system/ValidatorOutput'

export type ValidateStateNested = {
    validate: ValidateFn
    /**
     * @todo implement root schema/context
     * @todo move into params? as `params` is often passed down in nested contexts, yet not `state` itself
     * @todo for full support of resolving embedded templates, it must not be a simple schema, but more like a registry
     */
    root?: any
}

export type ValidateStateOutput = {
    output: ValidatorOutput
}

export type ValidateState =
    ValidateStateNested &
    ValidateStateOutput

export type ValidateLocationParams = {
    instanceLocation: (number | string)[]
    instanceKey?: number | string
}

export type ValidateControlParams = {
    /**
     * @todo implement? for that which uses `found`?!
     */
    failFast?: boolean
    /**
     * Controls if all levels are validated or only the current instance.
     *
     * Recursive enables validation of:
     * - for object: `properties`
     * - for array: `items`
     */
    recursive?: boolean
}

export type ValidateParams =
    ValidateLocationParams &
    ValidateControlParams

export type ValidateFn = <TData = unknown>(
    schema: any,
    value: unknown,
    params?: ValidateParams,
    state?: Partial<ValidateState>,
) =>
    { valid: true, value: TData, errors?: never } |
    { valid: false, errors: ValidatorOutput['errors'] }
